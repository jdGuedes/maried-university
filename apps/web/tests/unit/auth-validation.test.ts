import { describe, expect, it } from "vitest";
import { authMessages, formStates, isValidEmail, validateLoginFields, validateRecoveryFields, validateResetFields } from "../../lib/auth/validation";

describe("auth validation", () => {
  it("validates email format without revealing account existence", () => {
    expect(validateRecoveryFields("")).toEqual({ email: authMessages.emailRequired });
    expect(validateRecoveryFields("email-invalido")).toEqual({ email: authMessages.invalidEmail });
    expect(validateRecoveryFields("usuario@example.com")).toEqual({});
    expect(isValidEmail("usuario@example.com")).toBe(true);
    expect(isValidEmail("usuario@example")).toBe(false);
  });

  it("validates login required fields", () => {
    expect(validateLoginFields("", "")).toEqual({
      email: authMessages.emailRequired,
      password: authMessages.passwordRequired
    });

    expect(validateLoginFields("usuario@example.com", "segredo")).toEqual({});
  });

  it("validates reset password policy and confirmation", () => {
    expect(validateResetFields("", "")).toEqual({
      password: authMessages.passwordRequired,
      confirmPassword: authMessages.passwordRequired
    });

    expect(validateResetFields("123", "123")).toEqual({ password: authMessages.passwordTooShort });
    expect(validateResetFields("123456", "654321")).toEqual({ confirmPassword: authMessages.passwordMismatch });
    expect(validateResetFields("123456", "123456")).toEqual({});
  });

  it("keeps the official form state vocabulary", () => {
    expect(formStates).toEqual(["IDLE", "DIRTY", "VALID", "INVALID", "SUBMITTING", "SUBMITTED", "ERROR", "DISABLED", "READONLY"]);
  });
});