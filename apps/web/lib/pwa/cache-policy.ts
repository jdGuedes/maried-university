export const pwaVersion = "2026.07.31-spec-002-entrega-e";
export const pwaCachePrefix = "maried-university";
export const pwaStaticCacheName = `${pwaCachePrefix}-static-${pwaVersion}`;
export const pwaOfflineCacheName = `${pwaCachePrefix}-offline-${pwaVersion}`;
export const offlineFallbackPath = "/offline";

export type PwaCacheStrategy = "CACHE_FIRST" | "NETWORK_FIRST" | "NETWORK_ONLY";

export type PwaCacheDecision = {
  cacheable: boolean;
  category: "static-asset" | "public-navigation" | "authenticated" | "auth" | "api" | "supabase" | "offline" | "external";
  persistence: "persistent-safe" | "none";
  strategy: PwaCacheStrategy;
  reason: string;
};

const authenticatedPathPrefixes = ["/inicio", "/minha-conta", "/minha-assinatura", "/precificacao", "/estoque", "/fornecedores", "/minicursos"];
const authPathPrefixes = ["/auth", "/callback"];
const apiPathPrefixes = ["/api"];
const safeStaticPathPrefixes = ["/_next/static/", "/icons/", "/brand/"];
const publicNavigationPaths = ["/", "/login", "/recuperar-senha", "/redefinir-senha", "/acesso-negado", "/sessao-expirada", offlineFallbackPath];

export function isAuthenticatedPath(pathname: string) {
  return authenticatedPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAuthPath(pathname: string) {
  return authPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isApiPath(pathname: string) {
  return apiPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isSafeStaticAssetPath(pathname: string) {
  return safeStaticPathPrefixes.some((prefix) => pathname.startsWith(prefix)) || pathname === "/manifest.webmanifest" || pathname === "/favicon.ico";
}

export function isPublicNavigationPath(pathname: string) {
  return publicNavigationPaths.includes(pathname);
}

export function isSupabaseUrl(url: URL) {
  return url.hostname.includes("supabase.co") || url.hostname.includes("supabase.in") || url.pathname.includes("/rest/v1/") || url.pathname.includes("/auth/v1/");
}

export function getCacheDecision(input: string | URL, request?: Pick<Request, "method" | "headers">): PwaCacheDecision {
  const url = typeof input === "string" ? new URL(input, "http://localhost") : input;

  if (request?.method && request.method !== "GET") {
    return {
      cacheable: false,
      category: "api",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Mutating or non-GET requests are never cached."
    };
  }

  if (request?.headers?.has("authorization") || request?.headers?.has("apikey") || request?.headers?.has("x-client-info")) {
    return {
      cacheable: false,
      category: "authenticated",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Requests with sensitive Auth or Supabase client headers may contain authenticated data."
    };
  }

  if (isSupabaseUrl(url)) {
    return {
      cacheable: false,
      category: "supabase",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Supabase Auth, REST and RPC responses must not be persisted offline."
    };
  }

  if (isApiPath(url.pathname)) {
    return {
      cacheable: false,
      category: "api",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Application APIs may return sensitive or operational data."
    };
  }

  if (isAuthPath(url.pathname)) {
    return {
      cacheable: false,
      category: "auth",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Auth and callback routes may carry tokens or session transitions."
    };
  }

  if (isAuthenticatedPath(url.pathname)) {
    return {
      cacheable: false,
      category: "authenticated",
      persistence: "none",
      strategy: "NETWORK_ONLY",
      reason: "Authenticated pages may include profile, tenant or module state."
    };
  }

  if (url.pathname === offlineFallbackPath) {
    return {
      cacheable: true,
      category: "offline",
      persistence: "persistent-safe",
      strategy: "CACHE_FIRST",
      reason: "The offline fallback is public and contains no sensitive data."
    };
  }

  if (isSafeStaticAssetPath(url.pathname)) {
    return {
      cacheable: true,
      category: "static-asset",
      persistence: "persistent-safe",
      strategy: "CACHE_FIRST",
      reason: "Only public static assets are allowed in persistent cache."
    };
  }

  if (isPublicNavigationPath(url.pathname)) {
    return {
      cacheable: false,
      category: "public-navigation",
      persistence: "none",
      strategy: "NETWORK_FIRST",
      reason: "Public routes should prefer fresh network responses and fall back to the offline page."
    };
  }

  return {
    cacheable: false,
    category: "external",
    persistence: "none",
    strategy: "NETWORK_ONLY",
    reason: "Unknown routes are not cached by default."
  };
}
