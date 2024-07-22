const { test, expect, beforeEach, describe } = require("@playwright/test");
const { resetDatabase, createUser, login, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await resetDatabase(request);
    await createUser(request);
    await page.goto("http://localhost:5173");
  });

  /* test("Login form is shown", async ({ page }) => {
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
  }); */

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await login(page, "pau", "test");
    });

    /* test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();

      await page.getByTestId("title-input").fill("Test ");
      await page.getByTestId("author-input").fill("test1");
      await page.getByTestId("url-input").fill("http//:example.com");
      await page.getByRole("button", { name: "Create" }).click();

      const blogTitle = page.getByTestId("blog-title");
      const blogAuthor = page.getByTestId("blog-author");

      await expect(blogTitle).toHaveText("Test");
      await expect(blogAuthor).toHaveText("test1");
    }); */

    describe("blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "Test", "test1", "http//:example.com");
      });

      test("it can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).not.toBeVisible();
      });
    });
  });
});
