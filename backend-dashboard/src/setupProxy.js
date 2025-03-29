const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

module.exports = function(app) {
  // Serve static files from the larkon directory
  app.use('/larkon', express.static(path.join(__dirname, '../public/larkon')));

  // Fallback proxy configuration
  app.use(
    '/larkon',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};