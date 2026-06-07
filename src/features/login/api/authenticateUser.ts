import { backend } from '@/api'

export type LoginPayload = {
  email: string
  password: string
}

export async function authenticateUser(payload: LoginPayload): Promise<void> {
  return backend('/auth', {
    method: 'POST',
    body: payload,
  })
}
