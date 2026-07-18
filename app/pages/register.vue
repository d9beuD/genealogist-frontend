<script setup lang="ts">
import RegisterView from "~/features/auth/components/RegisterView.vue";

const { t } = useI18n();

definePageMeta({
  layout: false,
  middleware: "guest",
});

useHead({
  title: () => t("register.title"),
});
</script>

<template>
  <RegisterView />
</template>
