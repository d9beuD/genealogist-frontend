import { z } from "zod";

export interface LoginCredentialsValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

export function createLoginCredentialsSchema(
  messages: LoginCredentialsValidationMessages,
) {
  return z.object({
    email: z.string().min(1, messages.emailRequired).email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
}
