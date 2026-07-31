import { expect, test, type Page } from "@playwright/test";

const forbiddenClientSecrets = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "sk_live",
  "sk_test",
  "BEGIN PRIVATE KEY",
  "sb_secret"
];

async function expectNoSecrets(page: Page) {
  const html = await page.content();
  for (const secret of forbiddenClientSecrets) {
    expect(html, `${secret} must not appear in rendered HTML`).not.toContain(secret);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    bodyWidth: document.body.scrollWidth
  }));

  expect(overflow.documentWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(overflow.bodyWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewportWidth + 1);
}

test.describe("SPEC-002 Entrega C auth flows", () => {
  test("shows the real splash and resolves safely to login without a session", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "MARIED UNIVERSITY" })).toBeVisible();
    await expect(page.getByText(/Validando sess/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /Entre na MARIED UNIVERSITY/i })).toBeVisible();
    await expectNoSecrets(page);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `test-results/${testInfo.project.name}-entrega-c-login.png`, fullPage: true });
  });

  test("validates login fields, toggles password visibility and blocks unsafe next redirects", async ({ page }) => {
    await page.goto("/login?next=https://evil.example/phish", { waitUntil: "networkidle" });

    const email = page.getByLabel("E-mail");
    const password = page.locator("#login-password");
    const submit = page.getByRole("button", { name: /Entrar/i });

    await submit.click();
    await expect(page.getByText("Informe seu e-mail.").first()).toBeVisible();
    await expect(email).toBeFocused();

    await email.fill("email-invalido");
    await password.fill("segredo");
    await submit.click();
    await expect(page.getByText("E-mail inv\u00e1lido.").first()).toBeVisible();

    await email.fill("usuario@example.com");
    await expect(password).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Mostrar senha" }).click();
    await expect(password).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Ocultar senha" }).click();
    await expect(password).toHaveAttribute("type", "password");

    const nextValue = await page.locator('input[name="next"]').inputValue();
    expect(nextValue).toBe("/inicio");
    await expectNoSecrets(page);
  });

  test("keeps protected direct access behind the server-side guard", async ({ page }) => {
    await page.goto("/inicio", { waitUntil: "networkidle" });

    await expect(page).toHaveURL(/\/login\?next=%2Finicio|\/login/);
    await expect(page.getByRole("heading", { name: /Entre na MARIED UNIVERSITY/i })).toBeVisible();
    await expectNoSecrets(page);
  });

  test("uses a neutral password recovery message without account enumeration", async ({ page }) => {
    await page.goto("/recuperar-senha", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /Enviar instru/i }).click();
    await expect(page.getByText("Informe seu e-mail.").first()).toBeVisible();

    await page.getByLabel("E-mail").fill("nao-existe@example.com");
    await page.getByRole("button", { name: /Enviar instru/i }).click();
    await expect(page.getByText(/Se houver uma conta para este e-mail/i)).toBeVisible();
    await expect(page.getByText(/nao-existe@example.com/i)).toHaveCount(0);
    await expectNoSecrets(page);
  });

  test("handles reset password validation and invalid session safely", async ({ page }) => {
    await page.goto("/redefinir-senha", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /Salvar nova senha/i }).click();
    await expect(page.getByText("Informe sua senha.").first()).toBeVisible();

    await page.getByLabel("Nova senha").fill("123");
    await page.getByLabel("Confirmar senha").fill("456");
    await page.getByRole("button", { name: /Salvar nova senha/i }).click();
    await expect(page.getByText("A senha deve ter pelo menos 6 caracteres.").first()).toBeVisible();

    await page.getByLabel("Nova senha").fill("123456");
    await page.getByLabel("Confirmar senha").fill("654321");
    await page.getByRole("button", { name: /Salvar nova senha/i }).click();
    await expect(page.getByText("As senhas n\u00e3o coincidem.").first()).toBeVisible();
    await expectNoSecrets(page);
  });

  test("keeps keyboard navigation and visible focus in the login flow", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });

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
  });
});