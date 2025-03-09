import { defineConfig, UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig((env: ConfigEnv): UserConfig => {
  let common = {
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: "css",
          }),
        ],
      }),
    ],
    server: {
      port: 5000, 
      open: true, // 设置服务启动时是否自动打开浏览器
      cors: true, // 允许跨域
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://beta.laihua.com',
          changeOrigin: true
        }
      },
    },
    root: "./",
    base: "/live2d-/",
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
