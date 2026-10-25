import { expect, test } from "@playwright/test";

function uniqueEmail(): string {
  return `e2e-signup-${Date.now()}-${process.pid}@example.com`;
}

test("E2E-01 — cadastro válido", async ({ page }) => {
  const email = uniqueEmail();

  await page.goto("/");
  await page.getByRole("button", { name: "Criar Conta" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").nth(0).fill("Aa1@aaaaa");
  await page.getByPlaceholder("••••••••").nth(1).fill("Aa1@aaaaa");
  await page.getByRole("main").getByRole("button", { name: "Criar Conta" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();
});
