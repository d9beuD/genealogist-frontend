<script setup lang="ts">
import PeopleListView from "~/features/tree/presentation/components/PeopleListView.vue";
import { usePeople } from "~/features/tree/presentation/composables/usePeople";

definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const route = useRoute();
const { t } = useI18n();

const routeId = computed(() => {
  const raw = route.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
});

const treeId = computed(() => {
  const parsed = Number(routeId.value);
  return Number.isNaN(parsed) ? null : parsed;
});

const { people, pending, error } = await usePeople(treeId);

useHead({
  title: () => t("trees.people.title"),
});
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <Alert v-if="treeId === null" variant="destructive">
      <AlertTitle>{{ t("trees.people.invalidTreeTitle") }}</AlertTitle>
      <AlertDescription>{{ t("trees.people.invalidTreeDescription") }}</AlertDescription>
    </Alert>

    <PeopleListView
      v-else
      :people="people"
      :pending="pending"
      :error="error"
    />
  </div>
</template>
