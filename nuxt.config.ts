// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
const { GEMINI_KEY } = process.env;
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      meta: [{ name: "theme-color", content: "#DAAD29" }],
      link: [
        { rel: "icon", href: `/favicon.ico`, sizes: "48x48" },
        { rel: "apple-touch-icon", href: `/apple-touch-icon-180x180.png` },
      ],
    },
  },
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    registerType: "autoUpdate", // 多分なくてもよい
    manifest: {
      name: "MOODInk",
      description: "感情に合わせて色が変わる素敵なメモ帳",
      theme_color: "#DAAD29", // テーマカラー
      lang: "ja",
      short_name: "MOODInk",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      // なんか必要
      navigateFallback: null,
    },
    devOptions: {
      // テスト用
      enabled: true,
      type: "module",
    },
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    geminiKey: GEMINI_KEY,
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY,
    public: {
      // 必要に応じてここに公開設定を追加
    },
  },
  // privateRuntimeConfig: {
});
