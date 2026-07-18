import type { Collection, Item } from "~/lib/hydra";
import { getUnsafeRequestCsrfHeaders } from "~/lib/csrf";
import type { CreateTreeInput, Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

type NuxtFetch = typeof $fetch;

export function createNuxtTreeGateway(fetcher: NuxtFetch): TreeGateway {
  return {
    getTrees() {
      return fetcher<Collection<Tree>>("/api/trees");
    },
    createTree(input: CreateTreeInput) {
      const csrfHeaders = getUnsafeRequestCsrfHeaders();

      return fetcher<Item<Tree>>("/api/trees", {
        method: "POST",
        body: input,
        ...(csrfHeaders ? { headers: csrfHeaders } : {}),
      });
    },
  };
}
