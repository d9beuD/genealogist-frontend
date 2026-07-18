<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from "reka-ui"
import { reactiveOmit } from "@vueuse/core"
import { useForwardPropsEmits } from "reka-ui"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Command from "./Command.vue"

const props = defineProps<DialogRootProps & {
  title?: string
  description?: string
}>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, "title", "description")

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const { t } = useI18n()
</script>

<template>
  <Dialog v-slot="slotProps" v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 ">
      <DialogHeader class="sr-only">
        <DialogTitle>{{ title ?? t("common.commandPalette") }}</DialogTitle>
        <DialogDescription>{{ description ?? t("common.commandSearch") }}</DialogDescription>
      </DialogHeader>
      <Command>
        <slot v-bind="slotProps" />
      </Command>
    </DialogContent>
  </Dialog>
</template>
