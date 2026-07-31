import { expect, test } from "@playwright/test";

const forbiddenClientSecrets = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "sk_live",
  "sk_test",
  "BEGIN PRIVATE KEY"
];

test.describe("SPEC-002 Entrega A frontend foundation", () => {
  test("renders the structural foundation without overflow or exposed secrets", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(/MARIED UNIVERSITY/);
    await expect(page.getByRole("heading", { name: /Tokens, assets e estrutura global/i })).toBeVisible();
    await expect(page.getByText(/Entrega B/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Sem autoridade no browser/i })).toBeVisible();

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      bodyWidth: document.body.scrollWidth
    }));

    expect(overflow.documentWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);
    expect(overflow.bodyWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);

    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    const focusStyle = await focusedElement.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow
      };
    });

    expect(
      focusStyle.outlineStyle !== "none" || focusStyle.outlineWidth !== "0px" || focusStyle.boxShadow !== "none",
      JSON.stringify(focusStyle)
    ).toBeTruthy();

    const html = await page.content();
    for (const secret of forbiddenClientSecrets) {
      expect(html, `${secret} must not appear in rendered HTML`).not.toContain(secret);
    }

    await page.screenshot({ path: `test-results/${testInfo.project.name}-foundation.png`, fullPage: true });
  });
});
test.describe("SPEC-002 Entrega B access foundation", () => {
  test("redirects protected routes to the safe login placeholder when no server session exists", async ({ page }) => {
    await page.goto("/inicio", { waitUntil: "networkidle" });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /Login ainda nao implementado/i })).toBeVisible();
    await expect(page.getByText(/rotas autenticadas sem sessao validada no servidor/i)).toBeVisible();

    const html = await page.content();
    for (const secret of forbiddenClientSecrets) {
      expect(html, `${secret} must not appear in login placeholder HTML`).not.toContain(secret);
    }
  });

  test("keeps the login placeholder public and explicit about Entrega C scope", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: /Login ainda nao implementado/i })).toBeVisible();
    await expect(page.getByText(/A Entrega B prepara a sessao server-side/i)).toBeVisible();
    await expect(page.getByText(/O formulario oficial de login fica na Entrega C/i)).toBeVisible();
  });
});
