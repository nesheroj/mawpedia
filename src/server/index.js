global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
require('babel-register');
require('babel-polyfill');
require('./server.js');
