import { expect, test } from "@playwright/test";

test("E2E-02 — usuário deslogado tenta curtir", async ({ page }) => {
  await page.goto("/");

  const firstPost = page.getByRole("listitem").first();
  await expect(firstPost).toBeVisible();

  const dialogPromise = page.waitForEvent("dialog");
  const clickPromise = firstPost.getByRole("button", { name: /Curtir/ }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe("alert");
  expect(dialog.message()).toBe(
    "Você precisa estar autenticado para curtir posts!"
  );
  await dialog.accept();
  await clickPromise;
});
