<script setup lang="ts">
import { FolderOpen, Plus } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useTreeStore } from '@/stores/tree'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useI18n()
const treeStore = useTreeStore()
const { trees, isLoading } = storeToRefs(treeStore)
</script>

<template>
  <main class="mx-auto max-w-2xl">
    <Card v-if="trees.length > 0">
      <CardHeader>
        <CardTitle>{{ t('features.tree.yourTrees') }}</CardTitle>
        <CardDescription>
          {{ t('features.tree.selectTreeDescription') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3">
          <Button
            v-for="tree in trees"
            :key="tree.id"
            variant="outline"
            class="justify-start gap-3 text-left"
          >
            <FolderOpen class="shrink-0" />
            <span>{{ tree.name }}</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-else-if="!isLoading">
      <CardHeader class="text-center">
        <CardTitle>{{ t('features.tree.noTreesYet') }}</CardTitle>
        <CardDescription>
          {{ t('features.tree.createFirstTreeDescription') }}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center">
        <Button>
          <Plus class="mr-2" />
          {{ t('features.tree.createTree') }}
        </Button>
      </CardContent>
    </Card>

    <div v-else class="flex items-center justify-center p-8">
      <p class="text-sm text-muted-foreground">{{ t('features.tree.loading') }}</p>
    </div>
  </main>
</template>
