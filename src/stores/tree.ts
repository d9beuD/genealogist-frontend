import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTreeStore = defineStore('tree', () => {
  const selectedTreeId = ref<number | null>(null)

  function selectTree(id: number) {
    selectedTreeId.value = id
  }

  function deselectTree() {
    selectedTreeId.value = null
  }

  return {
    selectedTreeId,
    selectTree,
    deselectTree,
  }
})
