import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export type RegistrationValidationMessages = {
  emailRequired: string
  emailInvalid: string
  firstnameRequired: string
  firstnameTooShort: string
  lastnameRequired: string
  lastnameTooShort: string
  passwordRequired: string
  passwordTooShort: string
  confirmPasswordRequired: string
  passwordsMismatch: string
}

const requiredString = (message: string) => z.string({
  required_error: message,
  invalid_type_error: message,
}).trim().min(1, message)

const createBaseSchema = (messages: RegistrationValidationMessages) => z.object({
  email: requiredString(messages.emailRequired).email(messages.emailInvalid),
  firstname: requiredString(messages.firstnameRequired).min(2, messages.firstnameTooShort),
  lastname: requiredString(messages.lastnameRequired).min(2, messages.lastnameTooShort),
  plainPassword: requiredString(messages.passwordRequired).min(8, messages.passwordTooShort),
  confirmPassword: requiredString(messages.confirmPasswordRequired),
}).refine((data) => data.plainPassword === data.confirmPassword, {
  message: messages.passwordsMismatch,
  path: ['confirmPassword'],
})

export function createRegistrationSchema(messages: RegistrationValidationMessages) {
  return toTypedSchema(createBaseSchema(messages))
}

export type RegistrationFormData = z.infer<ReturnType<typeof createBaseSchema>>
