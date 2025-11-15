import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [react(), tsconfigPaths()],
    base: "/",
    server: {
      port: 5093,
      open: true,
    },

    resolve: {
      alias: {
        "@": "/src",
      },
    },

    build: {
      outDir: "dist",
      sourcemap: !isProd,
      minify: isProd,
    },
  };
});