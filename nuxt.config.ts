import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

const defaultLocale = "en";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/a11y",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/i18n",
  ],
  i18n: {
    defaultLocale,
    strategy: "prefix_and_default",
    restructureDir: ".",
    langDir: ".",
    locales: [
      {
        code: "en",
        files: ["app/features/login/i18n/en.ts"],
        name: "English",
      },
      {
        code: "fr",
        files: ["app/features/login/i18n/fr.ts"],
        name: "Français",
      },
    ],
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL ?? "http://localhost:8000",
    },
  },
});
