<script setup lang="ts">
import { watch } from "vue";
import type { Tree } from "~/features/tree/domain/tree";
import { useTrees } from "~/features/tree/presentation/composables/useTrees";

const route = useRoute();
const { selectedTree, setSelectedTree } = useSelectedTree();
const { trees } = await useTrees();

const routeId = computed(() => {
  const raw = route.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
});

function syncSelectedTree() {
  const numericId = Number(routeId.value);
  if (Number.isNaN(numericId)) return;

  const found = trees.value.find((t: Tree) => t.id === numericId);
  if (found && (!selectedTree.value || selectedTree.value.id !== numericId)) {
    setSelectedTree(found);
  }
}

watch([trees, routeId], syncSelectedTree, { immediate: true });
</script>

<template>
  <NuxtPage />
</template>
