import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import type { NuxtApp } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  return {
    provide: {
      queryClient,
    },
  };
});
