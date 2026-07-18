<script setup lang="ts">
import { onMounted } from "vue";
import type { Tree } from "~/features/tree/domain/tree";
import { useTrees } from "~/features/tree/presentation/composables/useTrees";

definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const routeId = computed(() => {
  const raw = route.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
});

const { selectedTree, setSelectedTree } = useSelectedTree();
const { trees, pending: treesPending } = await useTrees();

// Resolve tree name from the fetched list (SSR-safe).
const resolvedTree = computed(() => {
  const id = Number(routeId.value);
  if (Number.isNaN(id)) return null;

  return trees.value.find((t: Tree) => t.id === id) ?? null;
});

const treeName = computed(() => resolvedTree.value?.name ?? null);

// Sync selected tree state client-side only to avoid hydration mismatch.
onMounted(() => {
  const sync = () => {
    const numericId = Number(routeId.value);
    if (Number.isNaN(numericId)) return;

    const found = trees.value.find((t: Tree) => t.id === numericId);
    if (found && (!selectedTree.value || selectedTree.value.id !== numericId)) {
      setSelectedTree(found);
    }
  };

  sync();
  watch([trees, routeId], sync);
});

useHead({
  title: () => treeName.value ?? t("trees.detail.loadingTitle"),
});
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <template v-if="treesPending">
      <Skeleton class="h-9 w-48" />
    </template>

    <template v-else-if="treeName">
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ treeName }}
      </h1>
    </template>

    <Alert v-else variant="destructive">
      <AlertTitle>{{ t("trees.detail.notFoundTitle") }}</AlertTitle>
      <AlertDescription>
        {{ t("trees.detail.notFoundDescription") }}
        <NuxtLinkLocale :to="localePath('/')" class="underline">
          {{ t("trees.detail.backToDashboard") }}
        </NuxtLinkLocale>
      </AlertDescription>
    </Alert>
  </div>
</template>
