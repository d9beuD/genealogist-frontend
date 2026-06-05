import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const baseSchema = z.object({
  email: z.string().email().min(1),
  firstname: z.string().min(1).min(2),
  lastname: z.string().min(1).min(2),
  plainPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
}).refine((data) => data.plainPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const registrationSchema = toTypedSchema(baseSchema)

export type RegistrationFormData = z.infer<typeof baseSchema>
