import type { AuthUser } from '@/features/auth/types'

import { backend } from '@/api'

export const currentUserQueryKey = ['auth', 'me'] as const

export async function getCurrentUser(): Promise<AuthUser> {
  return backend<AuthUser>('/me')
}
