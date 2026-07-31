const DEFAULT_AUTHENTICATED_PATH = "/inicio";
const SAFE_REDIRECT_PREFIXES = ["/inicio", "/minha-conta", "/minha-assinatura", "/precificacao", "/estoque", "/fornecedores", "/minicursos"] as const;

export function getSafeRedirectPath(value: FormDataEntryValue | string | string[] | null | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  const trimmed = candidate.trim();

  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  const pathname = trimmed.split(/[?#]/, 1)[0] || DEFAULT_AUTHENTICATED_PATH;
  const isAllowed = SAFE_REDIRECT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return isAllowed ? trimmed : DEFAULT_AUTHENTICATED_PATH;
}

export function getLoginRedirectPath(reason?: string) {
  const query = reason ? `?status=${encodeURIComponent(reason)}` : "";
  return `/login${query}`;
}

export { DEFAULT_AUTHENTICATED_PATH, SAFE_REDIRECT_PREFIXES };