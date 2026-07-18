<script setup lang="ts">
import { useTrees } from "../composables/useTrees";

const { t, locale } = useI18n();
const { trees, pending, error } = await useTrees();

const dateFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value, { dateStyle: "medium" }),
);

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return dateFormatter.value.format(date);
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <div class="space-y-2">
      <p class="text-primary text-sm font-medium">{{ t("trees.eyebrow") }}</p>
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ t("trees.heading") }}
      </h1>
      <p class="text-muted-foreground max-w-2xl leading-6">
        {{ t("trees.description") }}
      </p>
    </div>

    <div
      v-if="pending"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-live="polite"
    >
      <Card v-for="index in 6" :key="index">
        <CardHeader>
          <Skeleton class="h-6 w-2/3" />
          <Skeleton class="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-4 w-full" />
        </CardContent>
      </Card>
    </div>

    <Alert v-else-if="error" variant="destructive">
      <AlertTitle>{{ t("trees.errorTitle") }}</AlertTitle>
      <AlertDescription>{{ t("trees.errorDescription") }}</AlertDescription>
    </Alert>

    <Empty v-else-if="trees.length === 0" class="border">
      <EmptyHeader>
        <EmptyTitle>{{ t("trees.emptyTitle") }}</EmptyTitle>
        <EmptyDescription>{{ t("trees.emptyDescription") }}</EmptyDescription>
      </EmptyHeader>
    </Empty>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card v-for="tree in trees" :key="tree.id">
        <CardHeader>
          <CardTitle>{{ tree.name }}</CardTitle>
          <CardDescription>
            {{ t("trees.createdAt", { date: formatCreatedAt(tree.createdAt) }) }}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </section>
</template>
