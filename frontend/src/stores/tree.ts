import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { TreeCollection } from '@/interfaces/treecollection'
import { fetchTrees } from '@/features/tree/api/trees'

export interface Tree {
  id: number
  name: string
}

export const useTreeStore = defineStore('tree', () => {
  const trees = ref<Tree[]>([])
  const selectedTreeId = ref<number | null>(null)
  const isLoading = ref(false)

  const selectedTree = computed(() => {
    return trees.value.find(t => t.id === selectedTreeId.value) ?? null
  })

  const hasTree = computed(() => selectedTreeId.value !== null)

  async function loadTrees() {
    isLoading.value = true
    try {
      const apiTrees = await fetchTrees()
      trees.value = apiTrees.map((t: TreeCollection) => ({ id: t.id ?? 0, name: t.name ?? '' }))
    } finally {
      isLoading.value = false
    }
  }

  function selectTree(id: number) {
    selectedTreeId.value = id
  }

  function deselectTree() {
    selectedTreeId.value = null
  }

  return {
    trees,
    selectedTreeId,
    selectedTree,
    hasTree,
    isLoading,
    loadTrees,
    selectTree,
    deselectTree,
  }
})
