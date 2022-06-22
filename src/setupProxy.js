const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api/todo/v1',
    createProxyMiddleware({
      target: 'https://62ab9821bd0e5d29af12f141.mockapi.io',
      changeOrigin: true,
    })
  );
};