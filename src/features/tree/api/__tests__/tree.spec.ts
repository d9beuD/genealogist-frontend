import { beforeEach, describe, expect, it, vi } from 'vitest'

import { backend } from '@/api'
import { deleteTree, fetchTree, updateTree } from '@/features/tree/api/tree'

vi.mock('@/api', () => ({
  backend: vi.fn<(request: string, options?: unknown) => Promise<unknown>>(),
}))

describe('tree item API', () => {
  beforeEach(() => {
    vi.mocked(backend).mockReset()
  })

  it('fetches a single tree resource', async () => {
    const tree = {
      '@context': '/api/contexts/TreeCollection',
      '@id': '/api/trees/7',
      '@type': 'TreeCollection',
      id: 7,
      name: 'Maternal line',
      createdAt: '2026-06-13T20:19:48.254Z',
    }

    vi.mocked(backend).mockResolvedValue(tree)

    await expect(fetchTree(7)).resolves.toEqual(tree)
    expect(backend).toHaveBeenCalledWith('/trees/7')
  })

  it('updates a tree resource', async () => {
    const updatedTree = {
      '@context': '/api/contexts/TreeCollection',
      '@id': '/api/trees/7',
      '@type': 'TreeCollection',
      id: 7,
      name: 'Renamed tree',
      createdAt: '2026-06-13T20:19:48.254Z',
    }

    vi.mocked(backend).mockResolvedValue(updatedTree)

    await expect(updateTree(7, { name: 'Renamed tree' })).resolves.toEqual(updatedTree)
    expect(backend).toHaveBeenCalledWith('/trees/7', {
      method: 'PUT',
      body: { name: 'Renamed tree' },
    })
  })

  it('deletes a tree resource', async () => {
    vi.mocked(backend).mockResolvedValue(undefined)

    await expect(deleteTree(7)).resolves.toBeUndefined()
    expect(backend).toHaveBeenCalledWith('/trees/7', {
      method: 'DELETE',
    })
  })
})
