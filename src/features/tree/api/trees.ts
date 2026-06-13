import { useQuery } from '@tanstack/vue-query'

import { backend } from '@/api'
import type { CreatedTree, TreeCollectionResponse } from '@/features/tree/api/types'

export const treesQueryKey = ['trees'] as const

export type TreeCollectionWithId = CreatedTree

function hasTreeId(tree: Partial<CreatedTree>): tree is TreeCollectionWithId {
  return typeof tree.id === 'number'
}

export async function fetchTrees(): Promise<TreeCollectionWithId[]> {
  const response = await backend<TreeCollectionResponse>('/trees')

  return response.member.filter(hasTreeId)
}

export function useTreesQuery() {
  return useQuery({
    queryKey: treesQueryKey,
    queryFn: fetchTrees,
  })
}
