import type { Credentials } from "@/types";

// Codes d'erreur (pas des phrases) : l'écran les traduit avec t(`auth.errors.${code}`)
export type FieldError = "emailRequired" | "emailInvalid" | "passwordRequired";

export type LoginErrors = Partial<Record<keyof Credentials, FieldError>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vérifie le formulaire avant d'appeler le service : objet vide = tout est bon
export function validateLogin({ email, password }: Credentials): LoginErrors {
  const errors: LoginErrors = {};

  if (!email.trim()) errors.email = "emailRequired";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = "emailInvalid";

  if (!password) errors.password = "passwordRequired";

  return errors;
}
