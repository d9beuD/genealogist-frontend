import { ofetch } from 'ofetch'

import { queryClient } from '@/query'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
import { env } from '@/env'
import { toAppError } from '@/lib/errors'
import { appendCsrfHeader } from './csrf'

const baseURL = env.VITE_BACKEND_BASE_URL

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
        headers: appendCsrfHeader({
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        }, 'POST', '/token/refresh'),
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
