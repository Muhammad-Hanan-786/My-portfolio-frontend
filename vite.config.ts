import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/My-portfolio-frontend/" : "/",
  server: {
    fs: {
      allow: [".."],
    },
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      serverFns: {
        disableCsrfMiddlewareWarning: true,
      },
    }),
    viteReact(),
  ],
});
