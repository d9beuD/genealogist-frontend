import { z } from "zod";

export interface RegisterCredentialsValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  firstnameRequired: string;
  lastnameRequired: string;
  passwordMin: string;
}

export function createRegisterCredentialsSchema(
  messages: RegisterCredentialsValidationMessages,
) {
  return z.object({
    email: z.string().min(1, messages.emailRequired).email(messages.emailInvalid),
    firstname: z.string().min(1, messages.firstnameRequired),
    lastname: z.string().min(1, messages.lastnameRequired),
    plainPassword: z.string().min(8, messages.passwordMin),
  });
}
