const ORIGINAL_ENV = process.env.NODE_ENV;

describe('logging helpers', () => {
  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('log writes to console when NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { log } = require('../app');

    log('hello world');

    expect(consoleSpy).toHaveBeenCalledWith('hello world');
  });

  test('log does not write to console when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { log } = require('../app');

    log('should not log');

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('logError writes to console when NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { logError } = require('../app');

    logError('boom');

    expect(consoleSpy).toHaveBeenCalledWith('boom');
  });

  test('logError does not write to console when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { logError } = require('../app');

    logError('no boom');

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});

