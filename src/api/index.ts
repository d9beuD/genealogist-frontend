import { ofetch } from 'ofetch'
import { toAppError } from '@/lib/errors'
import { addToRetryQueue, markAsRetry, refreshAccessToken } from './refresh'

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

export const backend = ofetch.create({
  baseURL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
  },
  onRequestError({ error }) {
    throw toAppError(error)
  },
  onResponseError({ error, response, options }) {
    const appError = toAppError(Object.assign(error ?? new Error(response.statusText), { data: response._data, response }))

    if (appError.status === 401) {
      const relativeUrl = response.url.replace(baseURL, '')
      addToRetryQueue(relativeUrl, options as unknown as Record<string, unknown>)
      refreshAccessToken()
      markAsRetry()
    }

    throw appError
  },
})

export default {}
