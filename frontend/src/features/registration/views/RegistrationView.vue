<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CenteredCardLayout from '@/components/layout/CenteredCardLayout.vue'
import { CardHeader, CardTitle } from '@/components/ui/card'
import RegistrationForm from '@/features/registration/components/RegistrationForm.vue'
import RegistrationHero from '@/features/registration/components/RegistrationHero.vue'

const router = useRouter()
const { t } = useI18n()
const activeTab = ref('register')
</script>

<template>
  <CenteredCardLayout>
    <template #header>
      <Tabs v-model="activeTab">
        <TabsList class="grid w-fit grid-cols-2">
          <TabsTrigger value="login" @click="router.push({ name: 'login' })">
            {{ t('auth.login', 'Sign in') }}
          </TabsTrigger>
          <TabsTrigger value="register">
            {{ t('auth.register', 'Create account') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </template>

    <CardHeader class="px-0 pb-6 text-center">
      <CardTitle class="text-2xl font-bold">
        {{ t('registration.title', 'Create your account') }}
      </CardTitle>
    </CardHeader>

    <RegistrationForm />

    <template #aside>
      <RegistrationHero />
    </template>
  </CenteredCardLayout>
</template>
