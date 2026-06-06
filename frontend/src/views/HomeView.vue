<script setup lang="ts">
import { FolderOpen, Plus } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useTreeStore } from '@/stores/tree'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const treeStore = useTreeStore()
const { trees, isLoading } = storeToRefs(treeStore)
</script>

<template>
  <main class="mx-auto max-w-2xl">
    <Card v-if="trees.length > 0">
      <CardHeader>
        <CardTitle>Your Trees</CardTitle>
        <CardDescription>
          Select a tree to start working on your family genealogy.
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
        <CardTitle>No trees yet</CardTitle>
        <CardDescription>
          Create your first family tree to get started.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center">
        <Button>
          <Plus class="mr-2" />
          Create Tree
        </Button>
      </CardContent>
    </Card>

    <div v-else class="flex items-center justify-center p-8">
      <p class="text-sm text-muted-foreground">Loading...</p>
    </div>
  </main>
</template>
