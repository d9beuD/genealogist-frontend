<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user } = useAuth();
const { t } = useI18n();
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-12">
    <section class="w-full space-y-3 rounded-xl border border-border/60 p-8 shadow-sm">
      <p class="text-primary text-sm font-medium">{{ t("home.eyebrow") }}</p>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t("home.heading") }}</h1>
      <p class="text-muted-foreground leading-6">
        {{ t("home.description", { email: user?.email }) }}
      </p>
    </section>
  </main>
</template>
