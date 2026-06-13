import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { backend } from '@/api'
import type { AppError } from '@/lib/errors'
import { treesQueryKey } from '@/features/tree/api/trees'
import type { CreateTreeRequest, CreatedTree } from '@/features/tree/api/types'

export async function fetchTree(id: number): Promise<CreatedTree> {
  return backend<CreatedTree>(`/trees/${id}`)
}

export async function updateTree(id: number, input: CreateTreeRequest): Promise<CreatedTree> {
  return backend<CreatedTree>(`/trees/${id}`, {
    method: 'PUT',
    body: input,
  })
}

export async function deleteTree(id: number): Promise<void> {
  await backend(`/trees/${id}`, {
    method: 'DELETE',
  })
}

export function useUpdateTreeMutation() {
  const queryClient = useQueryClient()

  return useMutation<CreatedTree, AppError, { id: number, input: CreateTreeRequest }>({
    mutationFn: ({ id, input }) => updateTree(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treesQueryKey })
    },
  })
}

export function useDeleteTreeMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, AppError, number>({
    mutationFn: deleteTree,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treesQueryKey })
    },
  })
}
