<script setup lang="ts">
import TreeListView from "~/features/tree/presentation/components/TreeListView.vue";

definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const { t } = useI18n();

useHead({
  title: () => t("trees.title"),
});
</script>

<template>
  <TreeListView />
</template>
