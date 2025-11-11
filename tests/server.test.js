const axios = require('axios');
const { startServer, stopServer } = require('../app');

describe('Server lifecycle utilities', () => {
  test('startServer launches the app and stopServer shuts it down', async () => {
    const server = await startServer(0);
    const { port } = server.address();

    const response = await axios.get(`http://127.0.0.1:${port}/`);
    expect(response.status).toBe(200);
    expect(response.data).toContain('<!DOCTYPE html>');

    await stopServer(server);
    expect(server.listening).toBe(false);
  });

  test('stopServer resolves gracefully when no server is provided', async () => {
    await expect(stopServer()).resolves.toBeUndefined();
  });
});

