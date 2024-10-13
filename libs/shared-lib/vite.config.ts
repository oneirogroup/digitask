/// <reference types="vitest" />
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), dtsPlugin({ rollupTypes: true })],
  build: {
    outDir: "build",
    ssr: true,
    sourcemap: true,
    assetsInlineLimit: 0,
    lib: {
      entry: {
        main: "src/main.ts"
      },
      name: "Shared Library",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames(chunkInfo) {
          return chunkInfo.name === "style.css" ? "style.css" : `assets/[name].[hash][extname]`;
        }
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/vitest.setup.js"]
  }
});
