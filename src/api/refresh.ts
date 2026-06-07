import { ofetch } from 'ofetch'

import { queryClient } from '@/query'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
import { AppError, toAppError } from '@/lib/errors'

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

let refreshPromise: Promise<void> | null = null
let isRetry = false

interface QueuedRequest {
  url: string
  options: Record<string, unknown>
  reject: (error: unknown) => void
}

const retryQueue: QueuedRequest[] = []

function getRelativeUrl(fullUrl: string): string {
  return fullUrl.replace(baseURL, '')
}

export function markAsRetry(): void {
  isRetry = true
}

export function resetRetryFlag(): void {
  isRetry = false
}

export function addToRetryQueue(url: string, options: Record<string, unknown>): void {
  retryQueue.push({ url, options, reject: () => {} })
}

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

      for (const entry of retryQueue) {
        try {
          await ofetch(entry.url, {
            baseURL,
            ...entry.options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/ld+json',
              Accept: 'application/ld+json',
              ...(entry.options.headers as Record<string, string> ?? {}),
            },
          })
        } catch (retryError) {
          entry.reject(retryError)
        }
      }

      resetRetryFlag()
      retryQueue.length = 0
    } catch (refreshError) {
      const appError = toAppError(refreshError)

      if (appError.status === 401) {
        for (const entry of retryQueue) {
          entry.reject(new AppError({
            status: 401,
            code: 'UNKNOWN',
            message: 'Unauthorized',
          }))
        }

        const auth = useAuthStore(pinia)
        auth.setAnonymous()
        queryClient.clear()

        const router = await import('@/router').then(m => m.default)
        router.push({ name: 'login' })
      }

      resetRetryFlag()
      retryQueue.length = 0
      throw refreshError
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
