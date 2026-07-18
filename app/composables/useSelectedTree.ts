import type { Tree } from "~/features/tree/domain/tree";
import { useState } from "#app/composables/state";

const stateKey = "app:selectedTree";

export function useSelectedTree() {
  const selectedTree = useState<Tree | undefined>(stateKey, () => undefined);

  function setSelectedTree(tree: Tree | undefined) {
    selectedTree.value = tree;
  }

  return { selectedTree, setSelectedTree };
}
