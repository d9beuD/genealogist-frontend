import { ofetch, type FetchOptions } from 'ofetch'
import { AppError, toAppError } from '@/lib/errors'
import { env } from '@/env'
import { appendCsrfHeader } from './csrf'
import { refreshAccessToken } from './refresh'

const baseURL = env.VITE_BACKEND_BASE_URL

const rawBackend = ofetch.create({
  baseURL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
  },
  onRequest({ request, options }) {
    options.headers = appendCsrfHeader(options.headers, options.method, String(request))
  },
  onRequestError({ error }) {
    throw toAppError(error)
  },
  onResponseError({ error, response }) {
    throw toAppError(Object.assign(error ?? new Error(response.statusText), { data: response._data, response }))
  },
})

export async function backend<T = unknown>(request: string, options?: FetchOptions): Promise<T> {
  try {
    return await rawBackend<T>(request, options as FetchOptions<'json'>)
  } catch (err) {
    if (err instanceof AppError && err.status === 401) {
      await refreshAccessToken()
      return await rawBackend<T>(request, options as FetchOptions<'json'>)
    }
    throw err
  }
}

export default {}
