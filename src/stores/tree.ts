import { ref } from 'vue'
import { defineStore } from 'pinia'

export const TREE_STORAGE_KEY = 'genealogist.selectedTree'

type StoredSelectedTree = {
  id: number
  name: string | null
}

export const useTreeStore = defineStore('tree', () => {
  const storedTree = readSelectedTree()
  const selectedTreeId = ref<number | null>(storedTree?.id ?? null)
  const selectedTreeName = ref<string | null>(storedTree?.name ?? null)

  function selectTree(id: number, name?: string | null) {
    selectedTreeId.value = id
    if (name !== undefined) {
      selectedTreeName.value = name
    }

    writeSelectedTree({
      id,
      name: selectedTreeName.value,
    })
  }

  function deselectTree() {
    selectedTreeId.value = null
    selectedTreeName.value = null
    globalThis.localStorage?.removeItem(TREE_STORAGE_KEY)
  }

  return {
    selectedTreeId,
    selectedTreeName,
    selectTree,
    deselectTree,
  }
})

function readSelectedTree(): StoredSelectedTree | null {
  const rawValue = globalThis.localStorage?.getItem(TREE_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredSelectedTree>
    if (typeof parsedValue.id !== 'number' || !Number.isFinite(parsedValue.id)) {
      return null
    }

    return {
      id: parsedValue.id,
      name: typeof parsedValue.name === 'string' ? parsedValue.name : null,
    }
  } catch {
    return null
  }
}

function writeSelectedTree(tree: StoredSelectedTree) {
  globalThis.localStorage?.setItem(TREE_STORAGE_KEY, JSON.stringify(tree))
}
