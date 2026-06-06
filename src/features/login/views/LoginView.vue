<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import CenteredCardLayout from '@/components/layout/CenteredCardLayout.vue'
import { CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/features/login/components/LoginForm.vue'
import RegistrationHero from '@/features/registration/components/RegistrationHero.vue'

const { t } = useI18n()
</script>

<template>
  <CenteredCardLayout>
    <CardHeader class="px-0 pb-6 text-center">
      <CardTitle class="text-2xl font-bold">
        {{ t('login.title', 'Welcome back') }}
      </CardTitle>
    </CardHeader>

    <LoginForm />

    <template #aside>
      <RegistrationHero />
    </template>
  </CenteredCardLayout>
</template>
