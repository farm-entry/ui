import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "FRONTLINE_");

  return {
    plugins: [react(), qrcode()],
    server: {
      proxy: {
        "/api/auth": {
          target: env.FRONTLINE_API_URL,
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          cookieDomainRewrite: "localhost", // Rewrite cookie domain for localhost
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
              // Log cookies being set
              if (proxyRes.headers["set-cookie"]) {
                console.log(
                  "Cookies being set:",
                  proxyRes.headers["set-cookie"]
                );
              }
            });
          },
        },
        "/api/health": {
          target: env.FRONTLINE_API_URL,
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          cookieDomainRewrite: "localhost", // Rewrite cookie domain for localhost
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
              // Log cookies being set
              if (proxyRes.headers["set-cookie"]) {
                console.log(
                  "Cookies being set:",
                  proxyRes.headers["set-cookie"]
                );
              }
            });
          },
        },
        "/api": {
          target: env.FRONTLINE_API_URL,
          changeOrigin: true,
          cookieDomainRewrite: "localhost", // Rewrite cookie domain for localhost
          secure: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              // Forward cookies from the browser to the API
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
              if (req.headers.cookie) {
                console.log("Forwarding cookies:", req.headers.cookie);
              }
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },
    // Expose env variables to the app
    define: {
      "process.env": env,
    },
  };
});
