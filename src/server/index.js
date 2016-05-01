global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__PRODUCTION__ = process.env.NODE_ENV === 'production';
require('babel-register');
require('babel-polyfill');
require('./server.js');
