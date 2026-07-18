import { getTrees } from "../../application/getTrees";
import { createNuxtTreeGateway } from "../../infrastructure/nuxtTreeGateway";

export async function useTrees() {
  const requestFetch = useRequestFetch();
  const gateway = createNuxtTreeGateway(requestFetch);

  const asyncData = await useAsyncData("trees", () => getTrees(gateway), {
    default: () => [],
  });

  return {
    ...asyncData,
    trees: asyncData.data,
  };
}
