<script setup lang="ts">
import { FolderOpen } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import TreeActionsMenu from '@/features/tree/components/TreeActionsMenu.vue'
import type { CreatedTree } from '@/features/tree/api/types'

defineProps<{
  tree: CreatedTree
}>()

const { t, d } = useI18n()
</script>

<template>
  <Card class="cursor-pointer transition hover:border-primary">
    <CardHeader class="relative">
      <div class="flex flex-col gap-1.5 pr-10">
        <CardTitle class="flex items-center gap-2">
          <FolderOpen class="shrink-0" />
          <span class="truncate">{{ tree.name }}</span>
        </CardTitle>
        <CardDescription v-if="tree.createdAt">
          {{ t('features.tree.createdOn', { date: d(new Date(tree.createdAt), 'medium') }) }}
        </CardDescription>
      </div>
      <div class="absolute top-3 right-3" @click.stop>
        <TreeActionsMenu :tree="tree" />
      </div>
    </CardHeader>
  </Card>
</template>
