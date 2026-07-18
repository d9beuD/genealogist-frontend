import type { Collection, Item } from "~/lib/hydra";
import type { CreateTreeInput, Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

type NuxtFetch = typeof $fetch;

export function createNuxtTreeGateway(fetcher: NuxtFetch): TreeGateway {
  return {
    getTrees() {
      return fetcher<Collection<Tree>>("/api/trees");
    },
    createTree(input: CreateTreeInput) {
      return fetcher<Item<Tree>>("/api/trees", {
        method: "POST",
        body: input,
      });
    },
  };
}
