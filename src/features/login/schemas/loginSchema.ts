import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export type LoginValidationMessages = {
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
}

const requiredString = (message: string) => z.string({
  required_error: message,
  invalid_type_error: message,
}).trim().min(1, message)

const createBaseSchema = (messages: LoginValidationMessages) => z.object({
  email: requiredString(messages.emailRequired).email(messages.emailInvalid),
  password: requiredString(messages.passwordRequired),
})

export function createLoginSchema(messages: LoginValidationMessages) {
  return toTypedSchema(createBaseSchema(messages))
}

export type LoginFormData = z.infer<ReturnType<typeof createBaseSchema>>
