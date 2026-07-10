<script setup lang="ts">
import { ref } from "vue";
import CenteredCardLayout from "~/components/layout/CenteredCardLayout.vue";

const email = ref("");
const password = ref("");
const activeTab = ref("login");
const { t } = useI18n();
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
          <TabsTrigger value="register" disabled>
            {{ t("auth.register") }}
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

    <form class="space-y-4">
      <div class="">
        <label class="text-sm font-medium mb-2" for="email">{{ t("login.emailLabel") }}</label>
        <Input id="email" v-model="email" type="email" autocomplete="email" :placeholder="t('login.emailPlaceholder')" />
      </div>

      <div class="">
        <div class="flex items-center justify-between gap-3 mb-2">
          <label class="text-sm font-medium" for="password">{{ t("login.passwordLabel") }}</label>
          <a class="text-primary text-sm font-medium hover:underline" href="#">
            {{ t("login.forgotPassword") }}
          </a>
        </div>
        <Input id="password" v-model="password" type="password" autocomplete="current-password" :placeholder="t('login.passwordPlaceholder')" />
      </div>

      <Separator />

      <Button class="w-full" type="submit">
        {{ t("login.submit") }}
      </Button>
    </form>

    <p class="text-muted-foreground text-sm leading-6">
      {{ t("login.newHere") }}
      <a class="text-primary font-medium hover:underline" href="#">
        {{ t("login.createAccount") }}
      </a>
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
