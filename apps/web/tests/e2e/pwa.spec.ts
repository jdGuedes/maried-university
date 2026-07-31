import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const forbiddenCacheTerms = ["profile", "profiles", "tenant", "tenant_members", "authorization", "supabase", "service_role", "sb_secret", "stripe"];

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    bodyWidth: document.body.scrollWidth
  }));

  expect(overflow.documentWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(overflow.bodyWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);
}

async function ensureServiceWorkerReady(page: Page) {
  await page.goto("/offline", { waitUntil: "networkidle" });
  const supported = await page.evaluate(() => "serviceWorker" in navigator);
  expect(supported).toBe(true);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload({ waitUntil: "networkidle" });
  }
  await expect(page.getByRole("heading", { name: /Voce esta sem conexao/i })).toBeVisible();
}

async function restoreOnline(context: BrowserContext) {
  await context.setOffline(false);
}

test.describe("SPEC-002 Entrega E PWA", () => {
  test.afterEach(async ({ context }) => {
    await restoreOnline(context);
  });

  test("serves an installable manifest with existing icons", async ({ page }) => {
    const response = await page.goto("/manifest.webmanifest");
    expect(response?.ok()).toBe(true);

    const manifest = await page.evaluate(() => JSON.parse(document.body.innerText));
    expect(manifest).toMatchObject({
      name: "MARIED UNIVERSITY",
      short_name: "MARIED",
      start_url: "/",
      scope: "/",
      display: "standalone",
      lang: "pt-BR"
    });
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/icons/maried-icon-192.png", sizes: "192x192" }),
        expect.objectContaining({ src: "/icons/maried-icon-512.png", sizes: "512x512" }),
        expect.objectContaining({ src: "/icons/maried-maskable-512.png", purpose: "maskable" })
      ])
    );

    for (const icon of manifest.icons) {
      const iconResponse = await page.request.get(icon.src);
      expect(iconResponse.ok(), `${icon.src} should be served`).toBe(true);
    }
  });

  test("shows the offline page without sensitive data or horizontal overflow", async ({ page }, testInfo) => {
    await page.goto("/offline", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: /Voce esta sem conexao/i })).toBeVisible();
    await expect(page.getByText(/Nenhum dado autenticado foi salvo/i)).toBeVisible();
    await expect(page.getByText(/tenant|profile|service_role|token|stripe/i)).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `test-results/${testInfo.project.name}-entrega-e-offline.png`, fullPage: true });
  });

  test("exposes a native install action only after beforeinstallprompt", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: /^Instalar$/i })).toHaveCount(0);

    await page.evaluate(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.defineProperty(event, "prompt", { value: async () => undefined });
      Object.defineProperty(event, "userChoice", { value: Promise.resolve({ outcome: "accepted", platform: "web" }) });
      window.dispatchEvent(event);
    });

    await expect(page.getByRole("button", { name: /^Instalar$/i })).toBeVisible();
    await page.getByRole("button", { name: /^Instalar$/i }).click();
    await expect(page.getByRole("button", { name: /^Instalar$/i })).toHaveCount(0);
  });

  test("registers the service worker and stores only safe cache entries", async ({ page }) => {
    await ensureServiceWorkerReady(page);

    const snapshot = await page.evaluate(async () => {
      const names = await caches.keys();
      const entries = [] as string[];
      for (const name of names) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        entries.push(...requests.map((request) => request.url));
      }
      return { names, entries };
    });

    expect(snapshot.names.some((name) => name.startsWith("maried-university-"))).toBe(true);
    expect(snapshot.entries.some((url) => url.includes("/offline"))).toBe(true);
    expect(snapshot.entries.some((url) => url.includes("/icons/maried-icon-192.png"))).toBe(true);

    const joined = snapshot.entries.join("\n").toLowerCase();
    for (const term of forbiddenCacheTerms) {
      expect(joined, `${term} must not be persisted in Cache Storage`).not.toContain(term);
    }
  });

  test("falls back to the safe offline page during navigation failures", async ({ page, context }) => {
    await ensureServiceWorkerReady(page);
    await context.setOffline(true);

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Voce esta sem conexao/i })).toBeVisible();
    await expect(page.getByText(/Nenhum dado autenticado foi salvo/i)).toBeVisible();
  });
});