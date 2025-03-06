import { defineConfig, UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig((env: ConfigEnv): UserConfig => {
  let common = {
    plugins: [vue()],
    server: {
      port: 5000,
    },
    root: "./",
    base: "/",
    publicDir: "./public",
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "@framework": path.resolve(__dirname, "./src/live2d/Framework/src"),
      },
    },
    build: {
      target: "modules",
      assetsDir: "assets",
      outDir: "./dist",
      sourcemap: env.mode == "development" ? true : false,
    },
  };

  return common;
});
