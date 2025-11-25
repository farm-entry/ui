import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nav': {
        target: 'https://nav.moglerfarms.com:7148/AppTest/ODataV4/',
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/nav/, '');
          // Append $format=json if not already present
          const separator = newPath.includes('?') ? '&' : '?';
          return newPath.includes('$format=json') ? newPath : `${newPath}${separator}$format=json`;
        },
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            req.headers['Authorization'] = 'Basic YXBwOnBmVDkxczlKdkFDU3JqellsK1ZqL2M2aWtjdGNmbTNpZEJuSlFVVS9zSTg9';
            console.log('headers:', req);
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/login': {
        target: 'https://frontline-farms-api-ed6c8a0f0ca0.herokuapp.com',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
        // secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api': {
        target: 'https://frontline-farms-api-ed6c8a0f0ca0.herokuapp.com',
        // rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Set the session cookie
            const sessionId = "s%3AlWgMMABGIjPfMKg_BkmFDYO90XoZuVW_.imsf0JBUuXgkucOBbxWgW2MomUgDfYi4ZS0Rf6nhxQ4"

            const existingCookies = req.headers.cookie;
            proxyReq.setHeader('Cookie', `${existingCookies}; sessionId=${sessionId}`);

            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    }
  },
});