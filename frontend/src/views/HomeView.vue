<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
</script>

<template>
  <main class="flex min-h-svh items-center justify-center bg-muted p-6">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Bienvenue</CardTitle>
        <CardDescription v-if="user">
          Connecté avec {{ user.email }}.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p v-if="user" class="text-sm text-muted-foreground">
          {{ user.firstname }} {{ user.lastname }}
        </p>
        <Button type="button" @click="auth.logout()">
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  </main>
</template>
