const proxy = require('http-proxy-middleware');

//In development mode, proxy API calls which request URI with prefix `/api` to a serve.js process running in background.
module.exports = function(app) {
  app.use(proxy('/api', { target: `:${process.env.REACT_APP_APP_SERVE_PORT}/` }));
  app.use(proxy('/newexchange', { target: `http://123.56.179.72:8081/` }));
  app.use(proxy('/kaptcha', { target: 'http://123.57.247.69:8082' }));
};
