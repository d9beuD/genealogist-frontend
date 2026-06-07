import { ofetch } from 'ofetch'

import { queryClient } from '@/query'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
import { toAppError } from '@/lib/errors'

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

let refreshPromise: Promise<void> | null = null

export function refreshAccessToken(): Promise<void> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      await ofetch('/token/refresh', {
        baseURL,
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
      })
    } catch (refreshError) {
      if (toAppError(refreshError).status === 401) {
        useAuthStore(pinia).setAnonymous()
        queryClient.clear()

        const router = await import('@/router').then(m => m.default)
        router.push({ name: 'login' })
      }

      throw toAppError(refreshError)
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
