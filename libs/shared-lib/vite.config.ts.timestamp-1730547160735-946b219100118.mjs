// vite.config.ts
import { defineConfig } from "file:///D:/digitask/node_modules/vite/dist/node/index.js";
import dtsPlugin from "file:///D:/digitask/node_modules/vite-plugin-dts/dist/index.mjs";
import tsconfigPaths from "file:///D:/digitask/node_modules/vite-tsconfig-paths/dist/index.js";
import react from "file:///D:/digitask/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = defineConfig({
  plugins: [tsconfigPaths(), react(), dtsPlugin({ rollupTypes: true })],
  resolve: { alias: { "react/jsx-runtime": "nativewind/jsx-runtime" } },
  build: {
    outDir: "build",
    ssr: true,
    sourcemap: true,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    lib: {
      entry: {
        "shared-lib": "src/main.ts"
      },
      name: "Dihitask Shared Library",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        chunkFileNames: "chunks/[hash].js",
        assetFileNames(chunkInfo) {
          return (chunkInfo.names?.length ? chunkInfo.names.includes("style.css") : chunkInfo.name === "style.css") ? "style.css" : "assets/[hash][extname]";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkaWdpdGFza1xcXFxsaWJzXFxcXHNoYXJlZC1saWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGRpZ2l0YXNrXFxcXGxpYnNcXFxcc2hhcmVkLWxpYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZGlnaXRhc2svbGlicy9zaGFyZWQtbGliL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGR0c1BsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XHJcblxyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbdHNjb25maWdQYXRocygpLCByZWFjdCgpLCBkdHNQbHVnaW4oeyByb2xsdXBUeXBlczogdHJ1ZSB9KV0sXHJcbiAgcmVzb2x2ZTogeyBhbGlhczogeyBcInJlYWN0L2pzeC1ydW50aW1lXCI6IFwibmF0aXZld2luZC9qc3gtcnVudGltZVwiIH0gfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBcImJ1aWxkXCIsXHJcbiAgICBzc3I6IHRydWUsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiB7XHJcbiAgICAgICAgXCJzaGFyZWQtbGliXCI6IFwic3JjL21haW4udHNcIlxyXG4gICAgICB9LFxyXG4gICAgICBuYW1lOiBcIkRpaGl0YXNrIFNoYXJlZCBMaWJyYXJ5XCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJjaHVua3MvW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGNodW5rSW5mby5uYW1lcz8ubGVuZ3RoID8gY2h1bmtJbmZvLm5hbWVzLmluY2x1ZGVzKFwic3R5bGUuY3NzXCIpIDogY2h1bmtJbmZvLm5hbWUgPT09IFwic3R5bGUuY3NzXCIpXHJcbiAgICAgICAgICAgID8gXCJzdHlsZS5jc3NcIlxyXG4gICAgICAgICAgICA6IFwiYXNzZXRzL1toYXNoXVtleHRuYW1lXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxvQkFBb0I7QUFDeFMsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sbUJBQW1CO0FBRTFCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsY0FBYyxHQUFHLE1BQU0sR0FBRyxVQUFVLEVBQUUsYUFBYSxLQUFLLENBQUMsQ0FBQztBQUFBLEVBQ3BFLFNBQVMsRUFBRSxPQUFPLEVBQUUscUJBQXFCLHlCQUF5QixFQUFFO0FBQUEsRUFDcEUsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsbUJBQW1CO0FBQUEsSUFDbkIsYUFBYTtBQUFBLElBQ2IsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsY0FBYztBQUFBLE1BQ2hCO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixlQUFlLFdBQVc7QUFDeEIsa0JBQVEsVUFBVSxPQUFPLFNBQVMsVUFBVSxNQUFNLFNBQVMsV0FBVyxJQUFJLFVBQVUsU0FBUyxlQUN6RixjQUNBO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
