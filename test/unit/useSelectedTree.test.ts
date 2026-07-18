import { describe, expect, it, vi } from "vitest";
import type { Tree } from "~/features/tree/domain/tree";

// Shared state store — simulates Nuxt's useState backing store.
const stateStore = new Map<string, { value: unknown }>();

// Mock #app/composables/state so the real composable can be imported.
vi.mock("#app/composables/state", () => ({
  useState: <T>(key: string, initializer: () => T) => {
    if (!stateStore.has(key)) {
      stateStore.set(key, { value: initializer() });
    }
    return stateStore.get(key)! as { value: T };
  },
}));

import { useSelectedTree } from "~/composables/useSelectedTree";

describe("useSelectedTree", () => {
  it("starts with undefined selection", () => {
    stateStore.clear();
    const { selectedTree } = useSelectedTree();
    expect(selectedTree.value).toBeUndefined();
  });

  it("sets and returns a tree", () => {
    stateStore.clear();
    const { selectedTree, setSelectedTree } = useSelectedTree();
    const tree: Tree = { id: 1, name: "Oak", createdAt: "2026-01-01" };
    setSelectedTree(tree);
    expect(selectedTree.value).toBe(tree);
  });

  it("clears selection when set to undefined", () => {
    stateStore.clear();
    const { selectedTree, setSelectedTree } = useSelectedTree();
    const tree: Tree = { id: 1, name: "Oak", createdAt: "2026-01-01" };
    setSelectedTree(tree);
    setSelectedTree(undefined);
    expect(selectedTree.value).toBeUndefined();
  });

  it("shares state across instances", () => {
    stateStore.clear();
    const a = useSelectedTree();
    const b = useSelectedTree();
    const tree: Tree = { id: 2, name: "Pine", createdAt: "2026-02-02" };
    a.setSelectedTree(tree);
    expect(b.selectedTree.value).toBe(tree);
    b.setSelectedTree(undefined);
    expect(a.selectedTree.value).toBeUndefined();
  });
});
