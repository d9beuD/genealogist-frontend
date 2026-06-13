import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { TREE_STORAGE_KEY, useTreeStore } from '@/stores/tree'

describe('useTreeStore', () => {
  const storage = new Map<string, string>()

  beforeEach(() => {
    setActivePinia(createPinia())
    storage.clear()
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
        clear: () => {
          storage.clear()
        },
      },
      configurable: true,
    })
  })

  it('starts without a selected tree', () => {
    const treeStore = useTreeStore()

    expect(treeStore.selectedTreeId).toBeNull()
  })

  it('restores the selected tree from storage', () => {
    globalThis.localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify({
      id: 42,
      name: 'Maternal line',
    }))

    const treeStore = useTreeStore()

    expect(treeStore.selectedTreeId).toBe(42)
    expect(treeStore.selectedTreeName).toBe('Maternal line')
  })

  it('selects and deselects a tree', () => {
    const treeStore = useTreeStore()

    treeStore.selectTree(42, 'Maternal line')

    expect(treeStore.selectedTreeId).toBe(42)
    expect(treeStore.selectedTreeName).toBe('Maternal line')
    expect(globalThis.localStorage.getItem(TREE_STORAGE_KEY)).toBe(JSON.stringify({
      id: 42,
      name: 'Maternal line',
    }))

    treeStore.deselectTree()

    expect(treeStore.selectedTreeId).toBeNull()
    expect(treeStore.selectedTreeName).toBeNull()
    expect(globalThis.localStorage.getItem(TREE_STORAGE_KEY)).toBeNull()
  })
})
