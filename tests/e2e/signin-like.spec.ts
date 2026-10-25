import { expect, test } from "@playwright/test";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:8080";
const strongPassword = "Aa1@aaaaa";

function uniqueEmail(): string {
  return `e2e-signin-${Date.now()}-${process.pid}@example.com`;
}

test("E2E-03 — login e curtida", async ({ page, playwright }) => {
  const email = uniqueEmail();
  const apiContext = await playwright.request.newContext({
    baseURL: apiBaseUrl,
  });

  try {
    const signupResponse = await apiContext.post("/auth/signup", {
      data: { email, password: strongPassword },
    });
    expect(signupResponse.status()).toBe(200);

    await page.goto("/signin");
    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(strongPassword);
    await page.getByRole("main").getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();

    const firstPost = page.getByRole("listitem").first();
    await expect(firstPost).toBeVisible();
    await firstPost.getByRole("button", { name: /Curtir/ }).click();
    await expect(firstPost.getByRole("button", { name: /Curtido/ })).toBeVisible();
  } finally {
    await apiContext.dispose();
  }
});
