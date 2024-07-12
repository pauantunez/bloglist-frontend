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

export { resetDatabase, createUser, login };
