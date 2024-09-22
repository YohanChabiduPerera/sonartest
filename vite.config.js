import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_BASE_URL": JSON.stringify(env.REACT_APP_BASE_URL),
      "process.env.VITE_ACCESS_KEY": JSON.stringify(env.ACCESS_KEY),
      "process.env.VITE_SECRET_KEY": JSON.stringify(env.SECRET_KEY),
      "process.env.VITE_REGION": JSON.stringify(env.REGION),
    },
    plugins: [react()],
    server: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0',
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
    },
    minify: false
  };
});
