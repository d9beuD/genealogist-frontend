<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const { user } = useAuth();
const { t } = useI18n();
</script>

<template>
  <section class="mx-auto w-full max-w-3xl">
    <div class="space-y-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
      <p class="text-primary text-sm font-medium">{{ t("home.eyebrow") }}</p>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t("home.heading") }}</h1>
      <p class="text-muted-foreground leading-6">
        {{ t("home.description", { email: user?.email }) }}
      </p>
    </div>
  </section>
</template>
