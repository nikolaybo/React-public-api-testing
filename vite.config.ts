import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env (no prefix filter) so non-VITE_ secrets stay server-side.
  const env = loadEnv(mode, process.cwd(), "");
  const bigbookKey = env.BIGBOOK_API_KEY ?? "";

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        "/api/bigbook": {
          target: "https://api.bigbookapi.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/bigbook/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (bigbookKey) {
                proxyReq.setHeader("x-api-key", bigbookKey);
              }
            });
          },
        },
      },
    },
  };
});
