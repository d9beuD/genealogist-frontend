import { beforeEach, describe, expect, it, vi } from 'vitest'

import { backend } from '@/api'
import { createTree } from '@/features/tree/api/createTree'

vi.mock('@/api', () => ({
  backend: vi.fn<(request: string, options?: unknown) => Promise<unknown>>(),
}))

describe('createTree', () => {
  beforeEach(() => {
    vi.mocked(backend).mockReset()
  })

  it('posts the create tree payload and returns the created tree resource', async () => {
    const createdTree = {
      '@context': '/api/contexts/TreeCollection',
      '@id': '/api/trees/42',
      '@type': 'TreeCollection',
      id: 42,
      name: 'Maternal line',
      createdAt: '2026-06-13T19:56:57.135Z',
    }

    vi.mocked(backend).mockResolvedValue(createdTree)

    await expect(createTree({ name: 'Maternal line' })).resolves.toEqual(createdTree)
    expect(backend).toHaveBeenCalledWith('/trees', {
      method: 'POST',
      body: { name: 'Maternal line' },
    })
  })
})
