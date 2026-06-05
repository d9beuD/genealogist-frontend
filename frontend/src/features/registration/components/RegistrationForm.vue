<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SubmissionHandler } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as VeeValidateForm,
} from '@/components/ui/form'

import { registrationSchema } from '@/features/registration/schemas/registrationSchema'
import type { RegistrationFormData } from '@/features/registration/schemas/registrationSchema'
import { registerUser } from '@/features/registration/api/registerUser'
import { AppError } from '@/lib/errors'
import { registrationMessages } from '@/features/registration/i18n/registrationMessages'
import { i18n } from '@/i18n'

const { t } = useI18n()

const locale = computed(() => i18n.global.locale.value as 'en' | 'fr')
const messages = computed(() => registrationMessages[locale.value] ?? registrationMessages.en)

const acceptedTerms = ref(false)

const onSubmit: SubmissionHandler = async (values, actions) => {
  const formData = values as RegistrationFormData

  try {
    await registerUser({
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
      plainPassword: formData.plainPassword,
    })

    toast.success(messages.value.successTitle, {
      description: messages.value.successDescription,
    })
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
  <VeeValidateForm :validation-schema="registrationSchema" @submit="onSubmit">
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

      <div class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="firstname">
          <FormItem>
            <FormLabel>{{ messages.firstname }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :placeholder="messages.firstnamePlaceholder"
                autocomplete="given-name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="lastname">
          <FormItem>
            <FormLabel>{{ messages.lastname }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :placeholder="messages.lastnamePlaceholder"
                autocomplete="family-name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <Separator />

      <FormField v-slot="{ componentField }" name="plainPassword">
        <FormItem>
          <FormLabel>{{ messages.password }}</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="password"
              :placeholder="messages.passwordPlaceholder"
              autocomplete="new-password"
            />
          </FormControl>
          <FormDescription>
            {{ t('registration.password_hint', 'Must be at least 8 characters') }}
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="confirmPassword">
        <FormItem>
          <FormLabel>{{ messages.confirmPassword }}</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="password"
              :placeholder="messages.passwordPlaceholder"
              autocomplete="new-password"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Separator />

      <div class="flex items-center gap-2">
        <Checkbox
          id="terms"
          :checked="acceptedTerms"
          @update:checked="acceptedTerms = $event"
        />
        <label
          for="terms"
          class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ messages.termsLabel }}
        </label>
      </div>

      <Button
        type="submit"
        class="w-full"
        :disabled="!acceptedTerms || isSubmitting"
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
