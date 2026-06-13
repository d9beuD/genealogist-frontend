import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { backend } from '@/api'
import type { AppError } from '@/lib/errors'
import { treesQueryKey } from '@/features/tree/api/trees'
import type { CreateTreeRequest, CreatedTree } from '@/features/tree/api/types'

export async function createTree(input: CreateTreeRequest): Promise<CreatedTree> {
  return backend<CreatedTree>('/trees', {
    method: 'POST',
    body: input,
  })
}

export function useCreateTreeMutation() {
  const queryClient = useQueryClient()

  return useMutation<CreatedTree, AppError, CreateTreeRequest>({
    mutationFn: createTree,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treesQueryKey })
    },
  })
}
