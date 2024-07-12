const { test, expect, beforeEach, describe } = require("@playwright/test");
const { resetDatabase, createUser } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await resetDatabase(request);
    await createUser(request);
    await page.goto("http://localhost:5174");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("pau");
      await page.getByTestId("password").fill("test");
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Pau logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("pau");
      await page.getByTestId("password").fill("error");
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Wrong credentials")).toBeVisible();
      await expect(page.getByText("Pau logged in")).not.toBeVisible();
    });
  });
});
