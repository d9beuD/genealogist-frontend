<script setup lang="ts">
import type { Person } from "~/features/tree/domain/person";

defineProps<{
  people: Person[];
  pending?: boolean;
  error?: unknown;
}>();

const { t } = useI18n();

function fullName(person: Person) {
  const name = [person.firstname, person.lastname].join(" ").trim();
  return name || person.birthName || t("trees.people.unknownName");
}

function yearFromDate(value: string | null) {
  if (!value) return null;

  const match = /^(\d{4})/.exec(value);
  return match?.[1] ?? null;
}

function lifeDates(person: Person) {
  const birthYear = yearFromDate(person.birth);
  const deathYear = yearFromDate(person.death);

  if (!birthYear && !deathYear && !person.dead) return null;

  return `${birthYear ?? "?"} — ${deathYear ?? (person.dead ? "?" : "")}`.trim();
}

function descriptionPieces(person: Person) {
  return [
    person.birthPlace ? t("trees.people.bornIn", { place: person.birthPlace }) : null,
    person.deathPlace ? t("trees.people.diedIn", { place: person.deathPlace }) : null,
    person.otherNames ? t("trees.people.otherNames", { names: person.otherNames }) : null,
  ].filter(Boolean);
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="space-y-2">
      <p class="text-primary text-sm font-medium">{{ t("trees.people.eyebrow") }}</p>
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ t("trees.people.heading") }}
      </h1>
      <p class="text-muted-foreground max-w-2xl leading-6">
        {{ t("trees.people.description") }}
      </p>
    </div>

    <div v-if="pending" class="flex flex-col gap-3" aria-live="polite">
      <Skeleton v-for="index in 3" :key="index" class="h-20 w-full" />
    </div>

    <Alert v-else-if="error" variant="destructive">
      <AlertTitle>{{ t("trees.people.errorTitle") }}</AlertTitle>
      <AlertDescription>{{ t("trees.people.errorDescription") }}</AlertDescription>
    </Alert>

    <Empty v-else-if="people.length === 0" class="border">
      <EmptyHeader>
        <EmptyTitle>{{ t("trees.people.emptyTitle") }}</EmptyTitle>
        <EmptyDescription>{{ t("trees.people.emptyDescription") }}</EmptyDescription>
      </EmptyHeader>
    </Empty>

    <ItemGroup v-else>
      <Item v-for="person in people" :key="person.id" variant="outline">
        <ItemContent>
          <ItemTitle>{{ fullName(person) }}</ItemTitle>
          <ItemDescription v-if="lifeDates(person)">
            {{ lifeDates(person) }}
          </ItemDescription>
          <ItemDescription v-if="descriptionPieces(person).length > 0">
            {{ descriptionPieces(person).join(" · ") }}
          </ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  </section>
</template>
