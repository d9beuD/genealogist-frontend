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

  it('fetches trees with usable ids', async () => {
    vi.mocked(backend).mockResolvedValue({
      totalItems: 3,
      member: [
        {
          '@context': '/api/contexts/TreeCollection',
          '@id': '/api/trees/1',
          '@type': 'TreeCollection',
          id: 1,
          name: 'Maternal line',
          createdAt: '2026-06-13T20:19:48.254Z',
        },
        {
          '@context': '/api/contexts/TreeCollection',
          '@id': '/api/trees/2',
          '@type': 'TreeCollection',
          id: 2,
          name: 'Paternal line',
          createdAt: '2026-06-13T20:20:48.254Z',
        },
        {
          '@context': '/api/contexts/TreeCollection',
          '@id': '/api/trees/missing-id',
          '@type': 'TreeCollection',
          name: 'Missing id',
          createdAt: '2026-06-13T20:21:48.254Z',
        },
      ],
    })

    await expect(fetchTrees()).resolves.toEqual([
      {
        '@context': '/api/contexts/TreeCollection',
        '@id': '/api/trees/1',
        '@type': 'TreeCollection',
        id: 1,
        name: 'Maternal line',
        createdAt: '2026-06-13T20:19:48.254Z',
      },
      {
        '@context': '/api/contexts/TreeCollection',
        '@id': '/api/trees/2',
        '@type': 'TreeCollection',
        id: 2,
        name: 'Paternal line',
        createdAt: '2026-06-13T20:20:48.254Z',
      },
    ])
    expect(backend).toHaveBeenCalledWith('/trees')
  })

  it('exports a stable query key', () => {
    expect(treesQueryKey).toEqual(['trees'])
  })
})
