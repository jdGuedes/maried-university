import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "../../app/manifest";

const swPath = resolve(process.cwd(), "public/sw.js");
const swSource = readFileSync(swPath, "utf8");

describe("PWA manifest contract", () => {
  it("uses installable MARIED metadata without fictitious shortcuts or screenshots", () => {
    const value = manifest();

    expect(value.name).toBe("MARIED UNIVERSITY");
    expect(value.short_name).toBe("MARIED");
    expect(value.start_url).toBe("/");
    expect(value.scope).toBe("/");
    expect(value.display).toBe("standalone");
    expect(value.lang).toBe("pt-BR");
    expect(value.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/icons/maried-icon-192.png", sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ src: "/icons/maried-icon-512.png", sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ src: "/icons/maried-maskable-512.png", sizes: "512x512", purpose: "maskable" })
      ])
    );
    expect(value.shortcuts).toBeUndefined();
    expect(value.screenshots).toBeUndefined();
  });

  it("points to existing local icon files", () => {
    const value = manifest();
    for (const icon of value.icons ?? []) {
      expect(existsSync(resolve(process.cwd(), "public", icon.src.replace(/^\//, "")))).toBe(true);
    }
  });
});

describe("PWA service worker contract", () => {
  it("is present, versioned and deletes old MARIED caches", () => {
    expect(existsSync(swPath)).toBe(true);
    expect(swSource).toContain("MARIED_PWA_VERSION");
    expect(swSource).toContain("maried-university");
    expect(swSource).toContain("caches.delete");
  });

  it("pre-caches only public safe assets and the offline fallback", () => {
    const precacheBlock = swSource.slice(swSource.indexOf("const MARIED_PRECACHE_URLS"), swSource.indexOf("const MARIED_AUTHENTICATED_PREFIXES"));
    expect(precacheBlock).toContain("/offline");
    expect(precacheBlock).toContain("/icons/maried-icon-192.png");
    expect(precacheBlock).not.toMatch(/\/inicio|\/minha-conta|tenant_members|profiles|supabase/i);
  });

  it("keeps authenticated, auth, API, Supabase and credentialed requests network-only", () => {
    expect(swSource).toContain("MARIED_AUTHENTICATED_PREFIXES");
    expect(swSource).toContain("MARIED_AUTH_PREFIXES");
    expect(swSource).toContain("MARIED_API_PREFIXES");
    expect(swSource).toContain("isSupabaseUrl");
    expect(swSource).toContain("hasSensitiveHeaders");
    expect(swSource).toContain("event.respondWith(fetch(request))");
  });

  it("activates updates only after the explicit skip-waiting message", () => {
    const installBlock = swSource.slice(swSource.indexOf("install"), swSource.indexOf("activate"));
    expect(installBlock).not.toContain("skipWaiting");
    expect(swSource).toContain("MARIED_SKIP_WAITING");
    expect(swSource).toContain("self.skipWaiting()");
  });
});