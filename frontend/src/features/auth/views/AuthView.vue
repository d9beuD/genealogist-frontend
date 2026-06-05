<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SplitScreenLayout from '@/components/layout/SplitScreenLayout.vue'
import { CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/features/login/components/LoginForm.vue'
import RegistrationHero from '@/features/registration/components/RegistrationHero.vue'

const router = useRouter()
const { t } = useI18n()
const activeTab = ref('login')
</script>

<template>
  <SplitScreenLayout>
    <template #header>
      <Tabs v-model="activeTab">
        <TabsList class="grid w-fit grid-cols-2">
          <TabsTrigger value="login">
            {{ t('auth.login', 'Sign in') }}
          </TabsTrigger>
          <TabsTrigger value="register" @click="router.push({ name: 'register' })">
            {{ t('auth.register', 'Create account') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </template>

    <CardHeader class="px-0 pb-6 text-center">
      <CardTitle class="text-2xl font-bold">
        {{ t('login.title', 'Welcome back') }}
      </CardTitle>
    </CardHeader>

    <LoginForm />

    <template #aside>
      <RegistrationHero />
    </template>
  </SplitScreenLayout>
</template>
