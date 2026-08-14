import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/My-portfolio-frontend/" : "/",
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      serverFns: {
        disableCsrfMiddlewareWarning: true,
      },
    }),
    nitro(),
    viteReact(),
  ],
});