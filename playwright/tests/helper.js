const resetDatabase = async (request) => {
  await request.post("http:localhost:3003/api/testing/reset");
};

const createUser = async (request) => {
  await request.post("http://localhost:3003/api/users", {
    data: {
      name: "Pau",
      username: "pau",
      password: "test",
    },
  });
};

const login = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title-input").fill(title);
  await page.getByTestId("author-input").fill(author);
  await page.getByTestId("url-input").fill(url);
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForSelector(`.blog-title:text("${title}")`);
  await page.waitForSelector(`.blog-author:text("${author}")`);
};

export { resetDatabase, createUser, login, createBlog };
