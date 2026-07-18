<script setup lang="ts">
import TreeListView from "~/features/tree/presentation/components/TreeListView.vue";

definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const { t } = useI18n();

useHead({
  title: () => t("dashboard.title"),
});
</script>

<template>
  <TreeListView />
</template>
