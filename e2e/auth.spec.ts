import { test, expect } from "@playwright/test";

test("a user can log in and reach the board", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.TEST_EMAIL!);
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/main/);
  await expect(page.getByRole("heading", { name: "Jumbingo" })).toBeVisible();
});