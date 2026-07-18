import type { Collection } from "~/lib/hydra";
import type { Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

type NuxtFetch = typeof $fetch;

export function createNuxtTreeGateway(fetcher: NuxtFetch): TreeGateway {
  return {
    getTrees() {
      return fetcher<Collection<Tree>>("/api/trees");
    },
  };
}
