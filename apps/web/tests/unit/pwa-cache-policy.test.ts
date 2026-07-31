import { describe, expect, it } from "vitest";
import { getCacheDecision, isAuthenticatedPath, isSafeStaticAssetPath, isSupabaseUrl, offlineFallbackPath, pwaOfflineCacheName, pwaStaticCacheName } from "../../lib/pwa/cache-policy";
import { getConnectionStatus, shouldShowInstallPrompt, shouldShowUpdatePrompt } from "../../lib/pwa/state";

describe("PWA cache policy", () => {
  it("uses versioned MARIED cache names", () => {
    expect(pwaStaticCacheName).toMatch(/^maried-university-static-2026\.07\.31-spec-002-entrega-e$/);
    expect(pwaOfflineCacheName).toMatch(/^maried-university-offline-2026\.07\.31-spec-002-entrega-e$/);
  });

  it("allows only public static assets and the offline fallback to persist", () => {
    expect(isSafeStaticAssetPath("/_next/static/chunk.js")).toBe(true);
    expect(isSafeStaticAssetPath("/icons/maried-icon-192.png")).toBe(true);
    expect(getCacheDecision("http://localhost/icons/maried-icon-192.png")).toMatchObject({ cacheable: true, strategy: "CACHE_FIRST", persistence: "persistent-safe" });
    expect(getCacheDecision(`http://localhost${offlineFallbackPath}`)).toMatchObject({ cacheable: true, category: "offline", persistence: "persistent-safe" });
  });

  it("keeps authenticated routes network-only", () => {
    for (const pathname of ["/inicio", "/minha-conta", "/minha-assinatura", "/precificacao", "/estoque", "/fornecedores", "/minicursos"]) {
      expect(isAuthenticatedPath(pathname)).toBe(true);
      expect(getCacheDecision(`http://localhost${pathname}`)).toMatchObject({ cacheable: false, category: "authenticated", strategy: "NETWORK_ONLY", persistence: "none" });
    }
  });

  it("keeps auth, APIs, Supabase and authorization headers network-only", () => {
    expect(getCacheDecision("http://localhost/auth/callback?code=abc")).toMatchObject({ cacheable: false, category: "auth", strategy: "NETWORK_ONLY" });
    expect(getCacheDecision("http://localhost/api/profile")).toMatchObject({ cacheable: false, category: "api", strategy: "NETWORK_ONLY" });
    expect(isSupabaseUrl(new URL("https://example.supabase.co/auth/v1/token"))).toBe(true);
    expect(getCacheDecision("https://example.supabase.co/rest/v1/profiles")).toMatchObject({ cacheable: false, category: "supabase", strategy: "NETWORK_ONLY" });
    expect(getCacheDecision("http://localhost/icons/maried-icon-512.png", { method: "GET", headers: new Headers({ authorization: "Bearer token" }) })).toMatchObject({ cacheable: false, category: "authenticated", strategy: "NETWORK_ONLY" });
    expect(getCacheDecision("http://localhost/icons/maried-icon-512.png", { method: "POST", headers: new Headers() })).toMatchObject({ cacheable: false, strategy: "NETWORK_ONLY" });
  });

  it("treats public navigation as network-first without persistent HTML cache", () => {
    expect(getCacheDecision("http://localhost/login")).toMatchObject({ cacheable: false, category: "public-navigation", strategy: "NETWORK_FIRST", persistence: "none" });
  });
});

describe("PWA UI state", () => {
  it("classifies connection transitions", () => {
    expect(getConnectionStatus(true, true)).toBe("online");
    expect(getConnectionStatus(true, false)).toBe("offline");
    expect(getConnectionStatus(false, true)).toBe("reconnected");
  });

  it("shows install and update prompts only when actionable", () => {
    expect(shouldShowInstallPrompt("available")).toBe(true);
    expect(shouldShowInstallPrompt("dismissed")).toBe(false);
    expect(shouldShowUpdatePrompt("available")).toBe(true);
    expect(shouldShowUpdatePrompt("activating")).toBe(true);
    expect(shouldShowUpdatePrompt("idle")).toBe(false);
  });
});