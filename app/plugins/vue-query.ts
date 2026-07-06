import { QueryClient } from "@tanstack/vue-query";

export default defineNuxtPlugin(() => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });

  return {
    provide: {
      queryClient,
    },
  };
});
