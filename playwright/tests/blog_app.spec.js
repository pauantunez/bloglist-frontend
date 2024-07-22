const { test, expect, beforeEach, describe } = require("@playwright/test");
const { resetDatabase, createUser, login, createBlog, likeTimes } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await resetDatabase(request);
    await createUser(request);
    await page.goto("http://localhost:5173");
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

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await login(page, "pau", "test");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();

      await page.getByTestId("title-input").fill("Test ");
      await page.getByTestId("author-input").fill("test1");
      await page.getByTestId("url-input").fill("http//:example.com");
      await page.getByRole("button", { name: "Create" }).click();

      const blogTitle = page.getByTestId("blog-title");
      const blogAuthor = page.getByTestId("blog-author");

      await expect(blogTitle).toHaveText("Test");
      await expect(blogAuthor).toHaveText("test1");
    });

    describe("blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "Test", "test1", "http//:example.com");
      });

      test("it can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).not.toBeVisible();
      });

      test("it can be deleted by the creator", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();

        const pageHTML = await page.content();
        const removeButton = page.getByRole("button", { name: "remove" });
        await removeButton.waitFor({ state: "visible", timeout: 5000 });

        page.on("dialog", async (dialog) => {
          await dialog.accept();
        });

        await removeButton.click();

        await expect(page.getByTestId("blog-title")).not.toBeVisible();
        await expect(page.getByTestId("blog-author")).not.toBeVisible();
      });

      test("it can not be deleted by other users", async ({ page }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await login(page, "test", "test");

        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();
      });

      describe("multiple blogs exist", () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, "blog1", "Test", "http//:example.com/1");
          await createBlog(page, "blog2", "Test", "http//:example.com/2");
          await createBlog(page, "blog3", "Test", "http//:example.com/3");
        });

        test("blogs are ordered by likes", async ({ page }) => {
          // Asegúrate de que todos los blogs están visibles
          await page.getByTestId("toggle-details-blog1").click();
          await page.getByTestId("toggle-details-blog2").click();
          await page.getByTestId("toggle-details-blog3").click();

          // Dar likes a los blogs
          const button1 = page.getByTestId("blog-likes-blog1").getByRole("button", { name: "like" });
          await likeTimes(page, button1, 1);
          await page.getByTestId("toggle-details-blog1").click();

          const button2 = page.getByTestId("blog-likes-blog2").getByRole("button", { name: "like" });
          await likeTimes(page, button2, 3);
          await page.getByTestId("toggle-details-blog2").click();

          const button3 = page.getByTestId("blog-likes-blog3").getByRole("button", { name: "like" });
          await likeTimes(page, button3, 2);
          await page.getByTestId("toggle-details-blog3").click();

          // Verificar el orden de los blogs
          const blogDivs = await page.locator(".blog").all();

          expect(await blogDivs[0].innerText()).toContain("blog2 by Test");
          expect(await blogDivs[1].innerText()).toContain("blog3 by Test");
          expect(await blogDivs[2].innerText()).toContain("blog1 by Test");
        });
      });
    });
  });
});
