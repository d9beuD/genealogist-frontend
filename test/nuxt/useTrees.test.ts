import { afterEach, describe, expect, it, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ref } from "vue";
import {
  CreateTreeAlreadyPendingError,
  useTrees,
} from "~/features/tree/presentation/composables/useTrees";
import type { Tree } from "~/features/tree/domain/tree";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  refreshShouldFail: false,
}));

mockNuxtImport("useRequestFetch", () => () => mocks.fetch);
mockNuxtImport("useAsyncData", () =>
async (
  _key: string,
  handler: () => Promise<Tree[]>,
  options?: { default?: () => Tree[] },
) => {
  const data = ref(await handler().catch(() => options?.default?.() ?? null));
  const error = ref<Error | null>(null);

  return {
    data,
    pending: ref(false),
    error,
    refresh: vi.fn(async () => {
      if (mocks.refreshShouldFail) {
        error.value = new Error("refresh failed");
        throw new Error("refresh failed");
      }

      data.value = await handler();
    }),
  };
});

describe("useTrees", () => {
  afterEach(() => {
    mocks.fetch.mockReset();
    mocks.refreshShouldFail = false;
  });

  it("rejects same normalized-name concurrent creates without sending a second request", async () => {
    const tree: Tree = {
      id: 1,
      name: "Oak",
      createdAt: "2026-07-18T00:00:00.000Z",
    };
    let resolveCreate: (tree: Tree) => void = () => {};
    const createResponse = new Promise<Tree>((resolve) => {
      resolveCreate = resolve;
    });

    mocks.fetch.mockImplementation((path, options) => {
      if (options?.method === "POST") {
        return createResponse;
      }

      return Promise.resolve({ member: [] });
    });

    const trees = await useTrees();

    const firstCreate = trees.createTree({ name: "Oak" });
    const secondCreate = trees.createTree({ name: " oak " });
    const secondCreateExpectation = expect(secondCreate).rejects.toBeInstanceOf(
      CreateTreeAlreadyPendingError,
    );

    expect(
      mocks.fetch.mock.calls.filter(([, options]) =>
        options?.method === "POST"
      ),
    ).toHaveLength(1);
    await secondCreateExpectation;
    expect(trees.createError.value).toBeNull();

    resolveCreate(tree);

    await expect(firstCreate).resolves.toBe(tree);
    expect(trees.createPending.value).toBe(false);
  });

  it("rejects distinct concurrent creates globally without sending a second request", async () => {
    const oak: Tree = {
      id: 1,
      name: "Oak",
      createdAt: "2026-07-18T00:00:00.000Z",
    };
    let resolveCreate: (tree: Tree) => void = () => {};
    const createResponse = new Promise<Tree>((resolve) => {
      resolveCreate = resolve;
    });

    mocks.fetch.mockImplementation((path, options) => {
      if (options?.method === "POST") {
        return createResponse;
      }

      return Promise.resolve({ member: [] });
    });

    const trees = await useTrees();

    const oakCreate = trees.createTree({ name: "Oak" });
    const pineCreate = trees.createTree({ name: "Pine" });
    const pineCreateExpectation = expect(pineCreate).rejects.toBeInstanceOf(
      CreateTreeAlreadyPendingError,
    );

    expect(
      mocks.fetch.mock.calls.filter(([, options]) =>
        options?.method === "POST"
      ),
    ).toHaveLength(1);
    expect(trees.createPending.value).toBe(true);
    await pineCreateExpectation;
    expect(trees.createError.value).toBeNull();

    resolveCreate(oak);
    await expect(oakCreate).resolves.toBe(oak);
    expect(trees.createPending.value).toBe(false);
  });

  it("resolves and keeps the optimistic tree when refresh fails", async () => {
    const tree: Tree = {
      id: 2,
      name: "Pine",
      createdAt: "2026-07-18T00:00:00.000Z",
    };

    mocks.fetch.mockImplementation((path, options) => {
      if (options?.method === "POST") {
        return Promise.resolve(tree);
      }

      return Promise.resolve({ member: [] });
    });
    mocks.refreshShouldFail = true;

    const trees = await useTrees();

    await expect(trees.createTree({ name: "Pine" })).resolves.toBe(tree);
    expect(trees.trees.value).toEqual([tree]);
    expect(trees.error.value).toBeNull();
    expect(trees.createError.value).toBeNull();
    expect(trees.createPending.value).toBe(false);
  });
});
