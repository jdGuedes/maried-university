import { describe, expect, it } from "vitest";
import { DEFAULT_AUTHENTICATED_PATH, SAFE_REDIRECT_PREFIXES, getLoginRedirectPath, getSafeRedirectPath } from "../../lib/auth/redirects";
import { authMessages } from "../../lib/auth/validation";

describe("auth flow contracts", () => {
  it("allows only approved internal authenticated destinations", () => {
    for (const prefix of SAFE_REDIRECT_PREFIXES) {
      expect(getSafeRedirectPath(prefix)).toBe(prefix);
      expect(getSafeRedirectPath(`${prefix}/detalhe`)).toBe(`${prefix}/detalhe`);
    }
  });

  it("blocks open redirects and unexpected public destinations", () => {
    expect(getSafeRedirectPath("https://evil.example/phish")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath("//evil.example/phish")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath("/login")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath("/auth/callback?next=https://evil.example")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath(null)).toBe(DEFAULT_AUTHENTICATED_PATH);
  });


  it("keeps app shell destinations protected and explicit", () => {
    expect(SAFE_REDIRECT_PREFIXES).toEqual(["/inicio", "/minha-conta", "/minha-assinatura", "/precificacao", "/estoque", "/fornecedores", "/minicursos"]);
    expect(getSafeRedirectPath("/admin")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath("/offline")).toBe(DEFAULT_AUTHENTICATED_PATH);
    expect(getSafeRedirectPath("/precificacao?from=dashboard")).toBe("/precificacao?from=dashboard");
    expect(getSafeRedirectPath("/minha-assinatura#plano")).toBe("/minha-assinatura#plano");
  });
  it("keeps status redirects local to login", () => {
    expect(getLoginRedirectPath("signed-out")).toBe("/login?status=signed-out");
    expect(getLoginRedirectPath()).toBe("/login");
  });

  it("keeps safe user-facing messages neutral", () => {
    expect(authMessages.invalidCredentials).toBe("E-mail ou senha incorretos.");
    expect(authMessages.recoveryNeutral).not.toMatch(/existe|inexistente/i);
  });
});