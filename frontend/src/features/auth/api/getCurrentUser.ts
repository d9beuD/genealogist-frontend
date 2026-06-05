import { backend } from '@/api'
import type { AuthUser } from '@/features/auth/types'

export const currentUserQueryKey = ['auth', 'me'] as const

export async function getCurrentUser(): Promise<AuthUser> {
  return backend<AuthUser>('/api/me')
}
