import { beforeEach, describe, expect, it, vi } from 'vitest'

import { backend } from '@/api'
import { fetchTrees, treesQueryKey } from '@/features/tree/api/trees'

vi.mock('@/api', () => ({
  backend: vi.fn<(request: string) => Promise<unknown>>(),
}))

describe('tree API', () => {
  beforeEach(() => {
    vi.mocked(backend).mockReset()
  })

  it('fetches and normalizes trees', async () => {
    vi.mocked(backend).mockResolvedValue([
      { id: 1, name: 'Maternal line' },
      { id: 2 },
      { name: 'Missing id' },
    ])

    await expect(fetchTrees()).resolves.toEqual([
      { id: 1, name: 'Maternal line' },
      { id: 2, name: '' },
    ])
    expect(backend).toHaveBeenCalledWith('/trees')
  })

  it('exports a stable query key', () => {
    expect(treesQueryKey).toEqual(['trees'])
  })
})
