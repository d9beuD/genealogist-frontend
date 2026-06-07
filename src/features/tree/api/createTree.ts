import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { backend } from '@/api'
import type { components } from '@/interfaces/api'
import { treesQueryKey } from '@/features/tree/api/trees'

export type CreateTreeInput = components['schemas']['TreeCollection.CreateTreeInput']
export type CreatedTree = components['schemas']['TreeCollection.TreeOutput']

export async function createTree(input: CreateTreeInput): Promise<CreatedTree> {
  return backend<CreatedTree>('/trees', {
    method: 'POST',
    body: input,
  })
}

export function useCreateTreeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTree,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treesQueryKey })
    },
  })
}
