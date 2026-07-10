<script setup lang="ts">
import { ref } from "vue"
import CenteredCardLayout from "~/components/layout/CenteredCardLayout.vue"

definePageMeta({
  layout: false,
  middleware: "guest",
});

useHead({
  title: "Login",
})

const email = ref("")
const password = ref("")
const activeTab = ref('login')
const { t } = useI18n()
</script>

<template>
  <CenteredCardLayout
    card-class="border-border/60 shadow-xl"
    content-class="gap-6"
    aside-class="bg-primary text-primary-foreground hidden md:flex md:flex-col md:justify-between p-8"
  >
    <template #header>
      <Tabs v-model="activeTab">
        <TabsList class="grid w-fit grid-cols-2">
          <TabsTrigger value="login">
            {{ t('auth.login', 'Sign in') }}
          </TabsTrigger>
          <TabsTrigger value="register" disabled>
            {{ t('auth.register', 'Create account') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </template>

    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p class="text-muted-foreground text-sm leading-6">
        Sign in to keep your family tree, archives, and notes in sync.
      </p>
    </div>

    <form class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium" for="email">Email</label>
        <Input id="email" v-model="email" type="email" autocomplete="email" placeholder="name@example.com" />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-3">
          <label class="text-sm font-medium" for="password">Password</label>
          <a class="text-primary text-sm font-medium hover:underline" href="#">
            Forgot password?
          </a>
        </div>
        <Input id="password" v-model="password" type="password" autocomplete="current-password" placeholder="••••••••" />
      </div>

      <Separator />

      <Button class="w-full" type="submit">
        Sign in
      </Button>
    </form>

    <p class="text-muted-foreground text-sm leading-6">
      New here?
      <a class="text-primary font-medium hover:underline" href="#">
        Create an account
      </a>
    </p>

    <template #aside>
      <div class="flex h-full flex-col gap-6 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-6">
        <div class="space-y-3">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Keep the family story moving
          </p>
          <h2 class="text-3xl font-semibold leading-tight">
            One place for names, dates, and the details that matter.
          </h2>
        </div>

        <div class="mt-auto grid gap-3 text-sm text-white/80">
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            Secure access for your account and records.
          </div>
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            Quick sign-in for returning researchers and editors.
          </div>
        </div>
      </div>
    </template>
  </CenteredCardLayout>
</template>
