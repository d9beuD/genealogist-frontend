import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface Tree {
  id: number
  name: string
}

export const useTreeStore = defineStore('tree', () => {
  const selectedTreeId = ref<number | null>(null)

  const selectedTree = computed(() => {
    // Will be populated when trees are fetched
    return null as Tree | null
  })

  const hasTree = computed(() => selectedTreeId.value !== null)

  function selectTree(id: number) {
    selectedTreeId.value = id
  }

  function deselectTree() {
    selectedTreeId.value = null
  }

  return {
    selectedTreeId,
    selectedTree,
    hasTree,
    selectTree,
    deselectTree,
  }
})
