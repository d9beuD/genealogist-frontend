import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export type CreateTreeValidationMessages = {
  nameRequired: string
  nameMax: string
}

const createBaseSchema = (messages: CreateTreeValidationMessages) =>
  z.object({
    name: z
      .string({
        required_error: messages.nameRequired,
        invalid_type_error: messages.nameRequired,
      })
      .trim()
      .min(1, messages.nameRequired)
      .max(120, messages.nameMax),
  })

export function createTreeFormSchema(messages: CreateTreeValidationMessages) {
  return toTypedSchema(createBaseSchema(messages))
}

export type CreateTreeFormData = z.infer<ReturnType<typeof createBaseSchema>>
