import { backend } from '@/api'

export type RegisterPayload = {
  email: string
  firstname: string
  lastname: string
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
