import type { CreateTreeInput, Tree } from "../../domain/tree";
import { createTree as createTreeApplication } from "../../application/createTree";
import { getTrees } from "../../application/getTrees";
import { createNuxtTreeGateway } from "../../infrastructure/nuxtTreeGateway";

export class CreateTreeAlreadyPendingError extends Error {
  constructor(name: string) {
    super(`Create tree request already pending for "${name}".`);
    this.name = "CreateTreeAlreadyPendingError";
  }
}

export async function useTrees() {
  const requestFetch = useRequestFetch();
  const gateway = createNuxtTreeGateway(requestFetch);

  const asyncData = await useAsyncData("trees", () => getTrees(gateway), {
    default: () => [],
  });

  const createPending = ref(false);
  const createError = ref<unknown>(null);

  function addTree(tree: Tree) {
    asyncData.data.value = [tree, ...(asyncData.data.value ?? [])];
  }

  function normalizeTreeName(name: string) {
    return name.trim().toLocaleLowerCase();
  }

  async function createTree(input: CreateTreeInput) {
    const normalizedName = normalizeTreeName(input.name);

    if (createPending.value) {
      throw new CreateTreeAlreadyPendingError(normalizedName);
    }

    createPending.value = true;
    createError.value = null;

    try {
      const tree = await createTreeApplication(gateway, input);
      addTree(tree);

      try {
        await asyncData.refresh();
      } catch {
        // The tree was created successfully. Keep the optimistic local list
        // update, clear Nuxt's refresh error state, and let the next list
        // refresh reconcile any stale data.
        asyncData.error.value = null;
      }

      return tree;
    } catch (error) {
      createError.value = error;
      throw error;
    } finally {
      createPending.value = false;
    }
  }

  return {
    ...asyncData,
    trees: asyncData.data,
    createTree,
    createPending,
    createError,
  };
}
