const path = require('path');

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '..', 'config');
process.env.NODE_ENV = 'test';
