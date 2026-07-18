import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { getPeople } from "../../application/getPeople";
import { createNuxtPersonGateway } from "../../infrastructure/nuxtPersonGateway";

export async function usePeople(treeId: MaybeRefOrGetter<number | null>) {
  const requestFetch = useRequestFetch();
  const gateway = createNuxtPersonGateway(requestFetch);

  const asyncData = await useAsyncData(
    () => {
      const id = toValue(treeId);
      return id === null ? "people:invalid-tree" : `people:${id}`;
    },
    () => {
      const id = toValue(treeId);
      if (id === null) return Promise.resolve([]);
      return getPeople(gateway, id);
    },
    {
      default: () => [],
      watch: [computed(() => toValue(treeId))],
    },
  );

  return {
    ...asyncData,
    people: asyncData.data,
  };
}
