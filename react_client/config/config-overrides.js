const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function override(config, env) {
  config.proxy = {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    },
  };

  config.headers = {
    'Access-Control-Allow-Origin': '*',
  };

  return config;
};
