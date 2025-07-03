import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  runtimeConfig :{
    public  :{
        apiBase : "https://backend-production-88df.up.railway.app"
    }
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nuxt-vue3-google-signin",
    "@pinia/nuxt",
  ],
  googleSignIn: {
    clientId: "CLIENT ID OBTAINED FROM GOOGLE API CONSOLE",
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
