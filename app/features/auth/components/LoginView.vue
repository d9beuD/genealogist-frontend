<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import CenteredCardLayout from "~/components/layout/CenteredCardLayout.vue";
import { useAuth } from "../composables/useAuth";
import { createLoginCredentialsSchema } from "../schema/loginCredentials";

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const activeTab = ref("login");
const { login, loading, error } = useAuth();

const form = useForm({
  validationSchema: toTypedSchema(createLoginCredentialsSchema({
    emailRequired: t("login.emailRequired"),
    emailInvalid: t("login.emailInvalid"),
    passwordRequired: t("login.passwordRequired"),
  })),
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  await login(values);
  await router.push(localePath("/"));
});
</script>

<template>
  <CenteredCardLayout
    card-class="border-border/60 shadow-xl"
    content-class="gap-6"
    aside-class="bg-primary text-primary-foreground hidden md:flex md:flex-col md:justify-between"
  >
    <template #header>
      <Tabs v-model="activeTab">
        <TabsList class="grid w-fit grid-cols-2">
          <TabsTrigger value="login">
            {{ t("auth.login") }}
          </TabsTrigger>
          <TabsTrigger value="register" :as-child="true">
            <NuxtLinkLocale to="/register">
              {{ t("auth.register") }}
            </NuxtLinkLocale>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </template>

    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ t("login.heading") }}
      </h1>
      <p class="text-muted-foreground text-sm leading-6">
        {{ t("login.description") }}
      </p>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>{{ t("login.emailLabel") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="email" autocomplete="email" :placeholder="t('login.emailPlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <div class="flex items-center justify-between gap-3 mb-2">
            <FormLabel>{{ t("login.passwordLabel") }}</FormLabel>
            <span class="text-muted-foreground text-sm font-medium" aria-disabled="true">
              {{ t("login.forgotPassword") }}
            </span>
          </div>
          <FormControl>
            <Input v-bind="componentField" type="password" autocomplete="current-password" :placeholder="t('login.passwordPlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <p v-if="error" class="text-destructive text-sm" role="alert">
        {{ t("login.error") }}
      </p>

      <Separator />

      <Button class="w-full" type="submit" :disabled="loading || undefined">
        {{ loading ? t("login.submitPending") : t("login.submit") }}
      </Button>
    </form>

    <p class="text-muted-foreground text-sm leading-6">
      {{ t("login.newHere") }}
      <NuxtLinkLocale class="text-primary font-medium hover:underline" to="/register">
        {{ t("login.createAccount") }}
      </NuxtLinkLocale>
    </p>

    <template #aside>
      <div class="flex h-full flex-col gap-6 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-8">
        <div class="space-y-3">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            {{ t("login.asideEyebrow") }}
          </p>
          <h2 class="text-3xl font-semibold leading-tight">
            {{ t("login.asideHeading") }}
          </h2>
        </div>

        <div class="mt-auto grid gap-3 text-sm text-white/80">
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            {{ t("login.asideSecurity") }}
          </div>
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            {{ t("login.asideQuickAccess") }}
          </div>
        </div>
      </div>
    </template>
  </CenteredCardLayout>
</template>
