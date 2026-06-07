import { envSchema, type PublicEnv } from './env.schema'

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid VITE_* environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid VITE_* environment variables')
}

export const env: PublicEnv = parsed.data
