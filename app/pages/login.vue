<script setup lang="ts">
import LoginView from "~/features/login/components/LoginView.vue";
import { loginMessages } from "~/features/login/i18n/loginMessages";

definePageMeta({
  layout: false,
  middleware: "guest",
});

useHead({
  title: loginMessages.title,
});
</script>

<template>
  <LoginView />
</template>
