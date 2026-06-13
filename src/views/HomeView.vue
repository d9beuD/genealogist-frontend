<script setup lang="ts">
import { FolderOpen, Plus } from '@lucide/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTreesQuery } from '@/features/tree/api/trees'
import { useTreeStore } from '@/stores/tree'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CreateTreeDialog from '@/features/tree/components/CreateTreeDialog.vue'

const { t, d } = useI18n()
const treeStore = useTreeStore()
const { data: trees, isLoading } = useTreesQuery()
const treeList = computed(() => trees.value ?? [])
</script>

<template>
  <main class="w-full">
    <template v-if="treeList.length > 0">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t('features.tree.yourTrees') }}</h1>
        <CreateTreeDialog>
          <template #trigger>
            <Button>
              <Plus />
              {{ t('features.tree.createTree') }}
            </Button>
          </template>
        </CreateTreeDialog>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="tree in treeList"
          :key="tree.id"
          class="cursor-pointer transition hover:border-primary"
          @click="treeStore.selectTree(tree.id)"
        >
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FolderOpen class="shrink-0" />
              <span class="truncate">{{ tree.name }}</span>
            </CardTitle>
            <CardDescription v-if="tree.createdAt">
              {{ t('features.tree.createdOn', { date: d(new Date(tree.createdAt), 'medium') }) }}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </template>

    <div v-else-if="!isLoading" class="w-full">
      <Card class="mx-auto max-w-2xl">
        <CardHeader class="text-center">
          <CardTitle>{{ t('features.tree.noTreesYet') }}</CardTitle>
          <CardDescription>
            {{ t('features.tree.createFirstTreeDescription') }}
          </CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center">
          <CreateTreeDialog>
            <template #trigger>
              <Button>
                <Plus />
                {{ t('features.tree.createTree') }}
              </Button>
            </template>
          </CreateTreeDialog>
        </CardContent>
      </Card>
    </div>

    <div v-else class="flex items-center justify-center p-8">
      <p class="text-sm text-muted-foreground">{{ t('features.tree.loading') }}</p>
    </div>
  </main>
</template>
