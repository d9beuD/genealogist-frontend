import type { UserRegistration } from '@/interfaces/userregistration'
import { backend } from '@/api'

export type RegisterPayload = UserRegistration & {
  plainPassword: string
}

export type RegisteredUser = {
  email: string
  firstname: string
  lastname: string
}

export async function registerUser(payload: RegisterPayload): Promise<RegisteredUser> {
  return backend<RegisteredUser>('/register', {
    method: 'POST',
    body: payload,
  })
}
