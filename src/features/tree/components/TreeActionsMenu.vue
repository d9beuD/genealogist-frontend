<script setup lang="ts">
import { Ellipsis, FolderOpen, Pencil, Trash2 } from '@lucide/vue'
import { computed, ref } from 'vue'
import type { SubmissionHandler } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as VeeValidateForm,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { createTreeFormSchema, type CreateTreeFormData } from '@/features/tree/schemas/createTreeSchema'
import type { CreatedTree } from '@/features/tree/api/types'
import { fetchTree, useDeleteTreeMutation, useUpdateTreeMutation } from '@/features/tree/api/tree'
import { AppError } from '@/lib/errors'
import { useTreeStore } from '@/stores/tree'

const props = defineProps<{
  tree: CreatedTree
}>()

const { t, tm, rt } = useI18n()
const treeStore = useTreeStore()

const menuOpen = ref(false)
const renameDialogOpen = ref(false)
const deleteDialogOpen = ref(false)

const { mutateAsync: renameTree, isPending: isRenaming } = useUpdateTreeMutation()
const { mutateAsync: removeTree, isPending: isDeleting } = useDeleteTreeMutation()
const isOpening = ref(false)

const renameValidationMessages = computed(() => {
  const raw = tm('features.tree.renameDialog.validation') as Record<string, unknown>
  return {
    nameRequired: rt(raw.nameRequired as string),
    nameMax: rt(raw.nameMax as string),
  }
})

const renameSchema = computed(() => createTreeFormSchema(renameValidationMessages.value))

async function openTree() {
  try {
    isOpening.value = true
    const tree = await fetchTree(props.tree.id)
    treeStore.selectTree(tree.id)
    toast.success(t('features.tree.openSuccess', { name: tree.name }))
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      status: null,
      code: 'UNKNOWN',
      message: t('features.tree.openError'),
    })

    toast.error(appError.message)
  } finally {
    isOpening.value = false
  }
}

const onRenameSubmit: SubmissionHandler = async (values, actions) => {
  const { name } = values as CreateTreeFormData

  try {
    const updated = await renameTree({ id: props.tree.id, input: { name } })
    toast.success(t('features.tree.renameDialog.success', { name: updated.name }))
    actions.resetForm({ values: { name: updated.name } })
    renameDialogOpen.value = false
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      status: null,
      code: 'UNKNOWN',
      message: t('features.tree.renameDialog.serverError'),
    })

    if (appError.fields && Object.keys(appError.fields).length > 0) {
      actions.setErrors(appError.fields)
      return
    }

    toast.error(appError.message)
  }
}

async function confirmDelete() {
  try {
    await removeTree(props.tree.id)

    if (treeStore.selectedTreeId === props.tree.id) {
      treeStore.deselectTree()
    }

    toast.success(t('features.tree.deleteDialog.success', { name: props.tree.name }))
    deleteDialogOpen.value = false
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      status: null,
      code: 'UNKNOWN',
      message: t('features.tree.deleteDialog.serverError'),
    })

    toast.error(appError.message)
  }
}

function openRenameDialog() {
  menuOpen.value = false
  renameDialogOpen.value = true
}

function openDeleteDialog() {
  menuOpen.value = false
  deleteDialogOpen.value = true
}

async function handleOpenAction() {
  menuOpen.value = false
  await openTree()
}
</script>

<template>
  <Dialog v-model:open="renameDialogOpen">
    <DialogContent @click.stop>
      <DialogHeader>
        <DialogTitle>{{ t('features.tree.renameDialog.title') }}</DialogTitle>
        <DialogDescription>
          {{ t('features.tree.renameDialog.description') }}
        </DialogDescription>
      </DialogHeader>

      <VeeValidateForm
        :validation-schema="renameSchema"
        :initial-values="{ name: tree.name }"
        @submit="onRenameSubmit"
      >
        <template #default="{ values }">
          <div class="flex flex-col gap-4">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>{{ t('features.tree.renameDialog.nameLabel') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    :placeholder="t('features.tree.renameDialog.namePlaceholder')"
                    autocomplete="off"
                    autofocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" :disabled="isRenaming" @click="renameDialogOpen = false">
                {{ t('features.tree.renameDialog.cancel') }}
              </Button>
              <Button type="submit" :disabled="!values.name || isRenaming">
                <template v-if="isRenaming">
                  <Spinner class="mr-2" />
                  {{ t('features.tree.renameDialog.submit') }}...
                </template>
                <template v-else>
                  {{ t('features.tree.renameDialog.submit') }}
                </template>
              </Button>
            </DialogFooter>
          </div>
        </template>
      </VeeValidateForm>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="deleteDialogOpen">
    <DialogContent @click.stop>
      <DialogHeader>
        <DialogTitle>{{ t('features.tree.deleteDialog.title') }}</DialogTitle>
        <DialogDescription>
          {{ t('features.tree.deleteDialog.description', { name: tree.name }) }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button type="button" variant="outline" :disabled="isDeleting" @click="deleteDialogOpen = false">
          {{ t('features.tree.deleteDialog.cancel') }}
        </Button>
        <Button type="button" variant="destructive" :disabled="isDeleting" @click="confirmDelete">
          <template v-if="isDeleting">
            <Spinner class="mr-2" />
            {{ t('features.tree.deleteDialog.confirm') }}...
          </template>
          <template v-else>
            {{ t('features.tree.deleteDialog.confirm') }}
          </template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <DropdownMenu v-model:open="menuOpen">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon-sm"
        class="text-muted-foreground"
        @click.stop
      >
        <Ellipsis />
        <span class="sr-only">{{ t('features.tree.actionsLabel', { name: tree.name }) }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      class="w-44"
      @click.stop
    >
      <DropdownMenuItem :disabled="isOpening" @select.prevent="handleOpenAction">
        <FolderOpen />
        {{ t('features.tree.actions.open') }}
      </DropdownMenuItem>
      <DropdownMenuItem @select.prevent="openRenameDialog">
        <Pencil />
        {{ t('features.tree.actions.rename') }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" @select.prevent="openDeleteDialog">
        <Trash2 />
        {{ t('features.tree.actions.delete') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
