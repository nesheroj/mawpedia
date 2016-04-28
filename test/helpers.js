require('babel-register');
require('babel-polyfill');

process.env.NODE_CONFIG_DIR = require('path').resolve(__dirname, '..', 'config');
