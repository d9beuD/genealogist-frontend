import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useTreeStore } from '@/stores/tree'

describe('useTreeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts without a selected tree', () => {
    const treeStore = useTreeStore()

    expect(treeStore.selectedTreeId).toBeNull()
  })

  it('selects and deselects a tree', () => {
    const treeStore = useTreeStore()

    treeStore.selectTree(42)

    expect(treeStore.selectedTreeId).toBe(42)

    treeStore.deselectTree()

    expect(treeStore.selectedTreeId).toBeNull()
  })
})
