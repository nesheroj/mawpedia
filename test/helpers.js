require('babel-register');
require('babel-polyfill');

process.env.NODE_CONFIG_DIR = require('path').resolve(__dirname, '..', 'config');

module.exports.mockContext = (req, res) => {

  const Koa = require('koa');
  const Stream = require('stream');
  const socket = new Stream.Duplex();
  req = req || { headers: {}, socket, __proto__: Stream.Readable.prototype };
  res = res || { _headers: {}, socket, __proto__: Stream.Writable.prototype };
  req.socket = req.socket || socket;
  res.socket = res.socket || socket;
  res.getHeader = key => res._headers[key.toLowerCase()];
  res.setHeader = (key, value) => {

    res._headers[key.toLowerCase()] = value;
    return value;

  };

  res.removeHeader = key => delete res._headers[key.toLowerCase()];
  return (new Koa()).createContext(req, res);

};

module.exports.request = (req, res) => module.exports.mockContext(req, res).request;

module.exports.response = (req, res) => module.exports.mockContext(req, res).response;

module.exports.failAfter = (t, time) => {

  const timeout = setTimeout(() => {

    t.end(`timed out after '${time}ms`);

  }, time || 500);

  return () => clearTimeout(timeout);

};
