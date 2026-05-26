import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { transform } from "esbuild";

const vidstackReactJsx = {
  name: "vidstack-react-jsx",
  enforce: "pre",
  async transform(code, id) {
    if (!id.includes("node_modules/@vidstack/react") || !id.endsWith(".js")) return null;
    const result = await transform(code, {
      loader: "jsx",
      jsx: "automatic",
      sourcemap: true
    });
    return { code: result.code, map: result.map };
  }
};

export default defineConfig({
  plugins: [
    vidstackReactJsx,
    react({
      include: [/src\/.*\.[tj]sx?$/, /node_modules\/@vidstack\/react\/.*\.js$/]
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
