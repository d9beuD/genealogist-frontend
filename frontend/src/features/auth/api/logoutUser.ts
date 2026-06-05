import { backend } from '@/api'

export async function logoutUser(): Promise<void> {
  return backend('/api/auth/logout', {
    method: 'POST',
  })
}
