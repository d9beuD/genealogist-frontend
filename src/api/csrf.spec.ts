import { describe, expect, it } from 'vitest'

import { appendCsrfHeader, readCookie, shouldAttachCsrfHeader } from '@/api/csrf'

describe('csrf helpers', () => {
  it('reads the csrf cookie value', () => {
    expect(readCookie('csrf_token', 'foo=bar; csrf_token=test-token; theme=dark')).toBe('test-token')
  })

  it('adds the csrf header for mutating api requests', () => {
    const headers = appendCsrfHeader(
      { Accept: 'application/ld+json' },
      'POST',
      '/trees',
    )

    expect(headers.get('X-CSRF-Token')).toBeNull()

    const headersWithCookie = appendCsrfHeader(
      { Accept: 'application/ld+json' },
      'POST',
      '/trees',
      'csrf_token=test-token',
    )

    expect(headersWithCookie.get('X-CSRF-Token')).toBe('test-token')
    expect(headersWithCookie.get('Accept')).toBe('application/ld+json')
  })

  it('skips csrf headers for exempt endpoints and safe methods', () => {
    expect(shouldAttachCsrfHeader('GET', '/trees')).toBe(false)
    expect(shouldAttachCsrfHeader('POST', '/auth')).toBe(false)
    expect(shouldAttachCsrfHeader('POST', '/register')).toBe(false)

    const authHeaders = appendCsrfHeader({}, 'POST', '/auth', 'csrf_token=test-token')
    expect(authHeaders.has('X-CSRF-Token')).toBe(false)
  })
})
