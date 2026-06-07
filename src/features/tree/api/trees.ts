import { useQuery } from '@tanstack/vue-query'

import type { TreeCollection } from '@/interfaces/treecollection'
import { backend } from '@/api'

export const treesQueryKey = ['trees'] as const

export type TreeCollectionWithId = TreeCollection & { id: number }

function hasTreeId(tree: TreeCollection): tree is TreeCollectionWithId {
  return typeof tree.id === 'number'
}

export async function fetchTrees(): Promise<TreeCollectionWithId[]> {
  const apiTrees = await backend<TreeCollection[]>('/trees')

  return apiTrees.filter(hasTreeId)
}

export function useTreesQuery() {
  return useQuery({
    queryKey: treesQueryKey,
    queryFn: fetchTrees,
  })
}
