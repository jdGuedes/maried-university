const MARIED_PWA_VERSION = "2026.07.31-spec-002-entrega-e";
const MARIED_CACHE_PREFIX = "maried-university";
const MARIED_STATIC_CACHE = `${MARIED_CACHE_PREFIX}-static-${MARIED_PWA_VERSION}`;
const MARIED_OFFLINE_CACHE = `${MARIED_CACHE_PREFIX}-offline-${MARIED_PWA_VERSION}`;
const MARIED_OFFLINE_URL = "/offline";

const MARIED_PRECACHE_URLS = [
  "/offline",
  "/manifest.webmanifest",
  "/icons/favicon.svg",
  "/icons/apple-touch-icon.png",
  "/icons/maried-icon-192.png",
  "/icons/maried-icon-512.png",
  "/icons/maried-maskable-512.png"
];

const MARIED_AUTHENTICATED_PREFIXES = [
  "/inicio",
  "/minha-conta",
  "/minha-assinatura",
  "/precificacao",
  "/estoque",
  "/fornecedores",
  "/minicursos"
];
const MARIED_AUTH_PREFIXES = ["/auth", "/callback"];
const MARIED_API_PREFIXES = ["/api"];
const MARIED_SAFE_STATIC_PREFIXES = ["/_next/static/", "/icons/", "/brand/"];

function hasPrefix(pathname, prefixes) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isSupabaseUrl(url) {
  return url.hostname.includes("supabase.co") || url.hostname.includes("supabase.in") || url.pathname.includes("/rest/v1/") || url.pathname.includes("/auth/v1/");
}

function hasSensitiveHeaders(request) {
  return request.headers.has("authorization") || request.headers.has("x-client-info") || request.headers.has("apikey");
}

function isSensitiveRequest(request, url) {
  if (request.method !== "GET") {
    return true;
  }

  if (url.origin !== self.location.origin) {
    return true;
  }

  return (
    hasSensitiveHeaders(request) ||
    isSupabaseUrl(url) ||
    hasPrefix(url.pathname, MARIED_API_PREFIXES) ||
    hasPrefix(url.pathname, MARIED_AUTH_PREFIXES) ||
    hasPrefix(url.pathname, MARIED_AUTHENTICATED_PREFIXES)
  );
}

function isSafeStaticAsset(pathname) {
  return MARIED_SAFE_STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || pathname === "/manifest.webmanifest" || pathname === "/favicon.ico";
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(MARIED_STATIC_CACHE);
    await cache.put(request, response.clone());
  }

  return response;
}

async function navigationWithOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(MARIED_OFFLINE_CACHE);
    return (await cache.match(MARIED_OFFLINE_URL)) || Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(MARIED_OFFLINE_CACHE).then((cache) => cache.addAll(MARIED_PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(MARIED_CACHE_PREFIX) && ![MARIED_STATIC_CACHE, MARIED_OFFLINE_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "MARIED_SW_ACTIVATED", version: MARIED_PWA_VERSION }));
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "MARIED_SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "MARIED_GET_VERSION") {
    event.source?.postMessage({ type: "MARIED_SW_VERSION", version: MARIED_PWA_VERSION });
  }

  if (event.data?.type === "MARIED_CLEAR_CACHES") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(MARIED_CACHE_PREFIX)).map((key) => caches.delete(key)))));
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (isSensitiveRequest(request, url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(navigationWithOfflineFallback(request));
    return;
  }

  if (isSafeStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});