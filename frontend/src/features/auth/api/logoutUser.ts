import { backend } from '@/api'

export async function logoutUser(): Promise<void> {
  return backend('/auth/logout', {
    method: 'POST',
  })
}
