const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { replaceYaleWithFale } = require('./lib/replaceYaleWithFale');

const app = express();
const isTestEnv = process.env.NODE_ENV === 'test';

function log(...args) {
  if (!isTestEnv) {
    console.log(...args);
  }
}

function logError(...args) {
  if (!isTestEnv) {
    console.error(...args);
  }
}

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to fetch and modify content
app.post('/fetch', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the content from the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use cheerio to parse HTML and selectively replace text content, not URLs
    const $ = cheerio.load(html);

    // Process text nodes in the body
    $('body *')
      .contents()
      .filter(function() {
        return this.nodeType === 3; // Text nodes only
      })
      .each(function() {
        // Replace text content but not in URLs or attributes
        const text = $(this).text();
        const newText = replaceYaleWithFale(text);
        if (text !== newText) {
          $(this).replaceWith(newText);
        }
      });

    // Process title separately
    const title = replaceYaleWithFale($('title').text());
    $('title').text(title);

    return res.json({
      success: true,
      content: $.html(),
      title: title,
      originalUrl: url,
    });
  } catch (error) {
    logError('Error fetching URL:', error.message);
    return res.status(500).json({
      error: `Failed to fetch content: ${error.message}`,
    });
  }
});

function startServer(port = process.env.PORT || 3001) {
  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        log(`Faleproxy server running at http://localhost:${port}`);
        resolve(server);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

function stopServer(server) {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    logError('Failed to start server:', error);
    process.exitCode = 1;
  });
}

module.exports = app;
module.exports.app = app;
module.exports.startServer = startServer;
module.exports.stopServer = stopServer;
module.exports.log = log;
module.exports.logError = logError;
