import { backend } from '@/api'

export type LoginPayload = {
  email: string
  password: string
}

export async function authenticateUser(payload: LoginPayload): Promise<void> {
  return backend('/api/auth', {
    method: 'POST',
    body: payload,
  })
}
