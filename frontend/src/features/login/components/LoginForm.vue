<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SubmissionHandler } from 'vee-validate'

import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as VeeValidateForm,
} from '@/components/ui/form'

import { createLoginSchema } from '@/features/login/schemas/loginSchema'
import type { LoginFormData } from '@/features/login/schemas/loginSchema'
import { authenticateUser } from '@/features/login/api/authenticateUser'
import { AppError } from '@/lib/errors'
import { loginMessages } from '@/features/login/i18n/loginMessages'
import { i18n } from '@/i18n'
const locale = computed(() => i18n.global.locale.value as 'en' | 'fr')
const messages = computed(() => loginMessages[locale.value] ?? loginMessages.en)
const validationSchema = computed(() => createLoginSchema(messages.value.validation))

const onSubmit: SubmissionHandler = async (values, actions) => {
  const formData = values as LoginFormData

  try {
    await authenticateUser({
      email: formData.email,
      password: formData.password,
    })

    toast.success(messages.value.submit)
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      status: null,
      code: 'UNKNOWN',
      message: messages.value.serverError,
    })

    if (appError.fields && Object.keys(appError.fields).length > 0) {
      actions.setErrors(appError.fields)
      return
    }

    toast.error(appError.message)
  }
}
</script>

<template>
  <VeeValidateForm :validation-schema="validationSchema" @submit="onSubmit">
    <template #default="{ isSubmitting }">
      <div class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ messages.email }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                :placeholder="messages.emailPlaceholder"
                autocomplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>{{ messages.password }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                :placeholder="messages.passwordPlaceholder"
                autocomplete="current-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Separator />

        <Button
          type="submit"
          class="w-full"
          :disabled="isSubmitting"
        >
          <template v-if="isSubmitting">
            <Spinner class="mr-2" />
            {{ messages.submit }}...
          </template>
          <template v-else>
            {{ messages.submit }}
          </template>
        </Button>
      </div>
    </template>
  </VeeValidateForm>
</template>
