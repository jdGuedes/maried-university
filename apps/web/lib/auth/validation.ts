export const authMessages = {
  emailRequired: "Informe seu e-mail.",
  passwordRequired: "Informe sua senha.",
  invalidEmail: "E-mail inv\u00e1lido.",
  invalidCredentials: "E-mail ou senha incorretos.",
  inactiveAccess: "Seu acesso est\u00e1 inativo. Entre em contato com o suporte.",
  accessEnded: "Seu per\u00edodo de acesso terminou.",
  genericFailure: "N\u00e3o foi poss\u00edvel entrar. Tente novamente.",
  recoveryNeutral: "Se houver uma conta para este e-mail, enviaremos as instru\u00e7\u00f5es de recupera\u00e7\u00e3o.",
  resetSuccess: "Senha redefinida com seguran\u00e7a. Entre novamente para continuar.",
  invalidResetLink: "Link inv\u00e1lido ou expirado. Solicite uma nova recupera\u00e7\u00e3o de senha.",
  passwordMismatch: "As senhas n\u00e3o coincidem.",
  passwordTooShort: "A senha deve ter pelo menos 6 caracteres."
} as const;

export const passwordPolicy = {
  minimumLength: 6,
  source: "supabase/config.toml auth.minimum_password_length"
} as const;

export const formStates = ["IDLE", "DIRTY", "VALID", "INVALID", "SUBMITTING", "SUBMITTED", "ERROR", "DISABLED", "READONLY"] as const;

export type AuthFormStatus = (typeof formStates)[number];

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type AuthActionState = {
  status: AuthFormStatus;
  message: string;
  fieldErrors: AuthFieldErrors;
};

export const idleAuthState: AuthActionState = {
  status: "IDLE",
  message: "",
  fieldErrors: {}
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateEmail(value: string) {
  const email = value.trim();

  if (!email) {
    return authMessages.emailRequired;
  }

  if (!isValidEmail(email)) {
    return authMessages.invalidEmail;
  }

  return "";
}

export function validatePassword(value: string) {
  if (!value) {
    return authMessages.passwordRequired;
  }

  if (value.length < passwordPolicy.minimumLength) {
    return authMessages.passwordTooShort;
  }

  return "";
}

export function validateLoginFields(email: string, password: string): AuthFieldErrors {
  return compactErrors({
    email: validateEmail(email),
    password: password ? "" : authMessages.passwordRequired
  });
}

export function validateRecoveryFields(email: string): AuthFieldErrors {
  return compactErrors({
    email: validateEmail(email)
  });
}

export function validateResetFields(password: string, confirmPassword: string): AuthFieldErrors {
  return compactErrors({
    password: validatePassword(password),
    confirmPassword: password && confirmPassword && password !== confirmPassword ? authMessages.passwordMismatch : confirmPassword ? "" : authMessages.passwordRequired
  });
}

export function hasFieldErrors(errors: AuthFieldErrors) {
  return Object.values(errors).some(Boolean);
}

function compactErrors(errors: AuthFieldErrors): AuthFieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => Boolean(value))) as AuthFieldErrors;
}