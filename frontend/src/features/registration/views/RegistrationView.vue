<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SplitScreenLayout from '@/components/layout/SplitScreenLayout.vue'
import { CardHeader, CardTitle } from '@/components/ui/card'
import RegistrationForm from '@/features/registration/components/RegistrationForm.vue'
import RegistrationHero from '@/features/registration/components/RegistrationHero.vue'

const { t } = useI18n()
</script>

<template>
  <SplitScreenLayout>
    <CardHeader class="px-0 pb-6 text-center">
      <CardTitle class="text-2xl font-bold">
        {{ t('registration.title', 'Create your account') }}
      </CardTitle>
    </CardHeader>

    <RegistrationForm />

    <template #aside>
      <RegistrationHero />
    </template>
  </SplitScreenLayout>
</template>
