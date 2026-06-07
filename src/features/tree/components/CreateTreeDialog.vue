<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SubmissionHandler } from 'vee-validate'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as VeeValidateForm,
} from '@/components/ui/form'

import { useCreateTreeMutation } from '@/features/tree/api/createTree'
import {
  createTreeFormSchema,
  type CreateTreeFormData,
} from '@/features/tree/schemas/createTreeSchema'
import { AppError } from '@/lib/errors'
import { useTreeStore } from '@/stores/tree'

const open = ref(false)
const { t, tm, rt } = useI18n()
const treeStore = useTreeStore()
const { mutateAsync, isPending } = useCreateTreeMutation()

const validationMessages = computed(() => {
  const raw = tm('features.tree.createDialog.validation') as Record<string, unknown>
  return {
    nameRequired: rt(raw.nameRequired as string),
    nameMax: rt(raw.nameMax as string),
  }
})

const validationSchema = computed(() => createTreeFormSchema(validationMessages.value))

const onSubmit: SubmissionHandler = async (values, actions) => {
  const { name } = values as CreateTreeFormData

  try {
    const created = await mutateAsync({ name })
    toast.success(t('features.tree.createDialog.success'))
    if (typeof created.id === 'number') {
      treeStore.selectTree(created.id)
    }
    actions.resetForm()
    open.value = false
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError({
            status: null,
            code: 'UNKNOWN',
            message: t('features.tree.createDialog.serverError'),
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
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot name="trigger" :open="() => (open = true)" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('features.tree.createDialog.title') }}</DialogTitle>
        <DialogDescription>
          {{ t('features.tree.createDialog.description') }}
        </DialogDescription>
      </DialogHeader>

      <VeeValidateForm :validation-schema="validationSchema" @submit="onSubmit">
        <template #default="{ values }">
          <div class="flex flex-col gap-4">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>{{ t('features.tree.createDialog.nameLabel') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    :placeholder="t('features.tree.createDialog.namePlaceholder')"
                    autocomplete="off"
                    autofocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                :disabled="isPending"
                @click="open = false"
              >
                {{ t('features.tree.createDialog.cancel') }}
              </Button>
              <Button type="submit" :disabled="!values.name || isPending">
                <template v-if="isPending">
                  <Spinner class="mr-2" />
                  {{ t('features.tree.createDialog.submit') }}...
                </template>
                <template v-else>
                  {{ t('features.tree.createDialog.submit') }}
                </template>
              </Button>
            </DialogFooter>
          </div>
        </template>
      </VeeValidateForm>
    </DialogContent>
  </Dialog>
</template>
