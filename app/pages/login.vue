<script setup lang="ts">
import LoginView from "~/features/login/components/LoginView.vue";

const { t } = useI18n();

definePageMeta({
  layout: false,
  middleware: "guest",
});

useHead({
  title: () => t("login.title"),
});
</script>

<template>
  <LoginView />
</template>
