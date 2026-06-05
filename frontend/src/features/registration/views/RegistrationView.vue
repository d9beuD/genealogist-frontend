<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RegistrationForm from '@/features/registration/components/RegistrationForm.vue'
import RegistrationHero from '@/features/registration/components/RegistrationHero.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-muted flex items-center justify-center p-4">
    <div class="w-full max-w-5xl">
      <Card class="overflow-hidden">
        <CardHeader class="text-center pb-6">
          <CardTitle class="text-2xl font-bold">
            {{ t('registration.title', 'Create your account') }}
          </CardTitle>
        </CardHeader>

        <CardContent class="p-0">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="p-6">
              <RegistrationForm />
            </div>

            <div class="hidden md:block">
              <RegistrationHero />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
