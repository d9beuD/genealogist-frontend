import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

const defaultLocale = "en";
const nitroI18nRuntimeConfigWarning =
  "Runtime config option `public` may not be able to be serialized.";

function suppressNitroI18nRuntimeConfigWarning(
  _options: unknown,
  nuxt: { hook: (name: string, callback: () => void) => void },
) {
  let originalWarn: typeof console.warn | undefined;
  let restoreTimeout: ReturnType<typeof setTimeout> | undefined;

  const restoreWarn = () => {
    if (originalWarn) {
      console.warn = originalWarn;
      originalWarn = undefined;
    }
  };

  // Nitro false positive for @nuxtjs/i18n's null-prototype public runtime config.
  nuxt.hook("nitro:config", () => {
    if (originalWarn) {
      return;
    }

    originalWarn = console.warn;
    console.warn = (...args: Parameters<typeof console.warn>) => {
      if (args.length === 1 && args[0] === nitroI18nRuntimeConfigWarning) {
        return;
      }

      originalWarn?.(...args);
    };
    restoreTimeout = setTimeout(() => {
      restoreTimeout = undefined;
      restoreWarn();
    }, 1000);
  });

  nuxt.hook("nitro:init", () => {
    if (restoreTimeout) {
      clearTimeout(restoreTimeout);
      restoreTimeout = undefined;
    }

    restoreWarn();
  });
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            (warning.code === "SOURCEMAP_ERROR" ||
              warning.code === "SOURCEMAP_BROKEN" ||
              warning.pluginCode === "SOURCEMAP_ERROR") &&
            warning.plugin === "nuxt:module-preload-polyfill"
          ) {
            return;
          }

          const isVueUseInvalidPureAnnotation =
            warning.code === "INVALID_ANNOTATION" &&
            (warning.id?.includes("@vueuse/core") ||
              warning.message.includes("@vueuse/core")) &&
            (warning.message.includes("#__PURE__") ||
              /\bPURE\b/.test(warning.message));

          if (isVueUseInvalidPureAnnotation) {
            return;
          }

          warn(warning);
        },
      },
    },
    optimizeDeps: {
      include: ["@lucide/vue"],
    },
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
    suppressNitroI18nRuntimeConfigWarning,
  ],
  i18n: {
    defaultLocale,
    strategy: "prefix_and_default",
    restructureDir: ".",
    langDir: ".",
    locales: [
      {
        code: "en",
        files: [
          "app/features/auth/i18n/en.ts",
        ],
        name: "English",
      },
      {
        code: "fr",
        files: [
          "app/features/auth/i18n/fr.ts",
        ],
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
    apiBaseUrl: "http://localhost:8000",
  },
});
