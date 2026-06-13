const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const CSRF_EXEMPT_PATHS = new Set(['/auth', '/register'])

export function appendCsrfHeader(
  headers: HeadersInit | undefined,
  method: string | undefined,
  request: string,
  cookieSource?: string,
): Headers {
  const nextHeaders = new Headers(headers)

  if (!shouldAttachCsrfHeader(method, request)) {
    return nextHeaders
  }

  const csrfToken = readCookie(CSRF_COOKIE_NAME, cookieSource)
  if (csrfToken) {
    nextHeaders.set(CSRF_HEADER_NAME, csrfToken)
  }

  return nextHeaders
}

export function shouldAttachCsrfHeader(method: string | undefined, request: string): boolean {
  const normalizedMethod = method?.toUpperCase() ?? 'GET'
  if (SAFE_METHODS.has(normalizedMethod)) {
    return false
  }

  return !CSRF_EXEMPT_PATHS.has(normalizeRequestPath(request))
}

export function readCookie(name: string, cookieSource = typeof document === 'undefined' ? '' : document.cookie): string | undefined {
  if (!cookieSource) {
    return undefined
  }

  for (const entry of cookieSource.split(';')) {
    const [rawName, ...rawValue] = entry.trim().split('=')
    if (rawName === name) {
      const value = rawValue.join('=')
      return value ? decodeURIComponent(value) : ''
    }
  }

  return undefined
}

function normalizeRequestPath(request: string): string {
  if (request.startsWith('http://') || request.startsWith('https://')) {
    return new URL(request).pathname.replace(/^\/api/, '') || '/'
  }

  return request.startsWith('/api/')
    ? request.replace(/^\/api/, '')
    : request
}
