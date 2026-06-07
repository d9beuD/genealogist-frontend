import { useQuery } from '@tanstack/vue-query'

import type { TreeCollection } from '@/interfaces/treecollection'
import { backend } from '@/api'

export interface Tree {
  id: number
  name: string
}

export const treesQueryKey = ['trees'] as const

function hasTreeId(tree: TreeCollection): tree is TreeCollection & { id: number } {
  return typeof tree.id === 'number'
}

export async function fetchTrees(): Promise<Tree[]> {
  const apiTrees = await backend<TreeCollection[]>('/trees')

  return apiTrees
    .filter(hasTreeId)
    .map(tree => ({ id: tree.id, name: tree.name ?? '' }))
}

export function useTreesQuery() {
  return useQuery({
    queryKey: treesQueryKey,
    queryFn: fetchTrees,
  })
}
