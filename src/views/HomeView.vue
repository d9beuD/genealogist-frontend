<script setup lang="ts">
import { Plus } from '@lucide/vue'
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
import TreeList from '@/features/tree/components/TreeList.vue'

const { t } = useI18n()
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

      <TreeList :trees="treeList" @select="treeStore.selectTree" />
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
