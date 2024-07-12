import { render, screen, waitFor } from "@testing-library/react";
import BlogForm from "../components/BlogForm";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";
import blogService from "../services/blogs";

/* test("<BlogForm /> calls onSubmit with correct details", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  // Simular la entrada de texto en los campos de formulario
  await user.type(screen.getByTestId("title-input"), "Test Blog Title");
  await user.type(screen.getByTestId("author-input"), "Test Author");
  await user.type(screen.getByTestId("url-input"), "https://example.com/test-blog");

  // Encontrar y hacer clic en el botón de envío
  await user.click(screen.getByText("create"));

  // Verificar que la función createBlog fue llamada con los detalles correctos
  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Test Blog Title",
    author: "Test Author",
    url: "https://example.com/test-blog",
  });
});

test("<Blog /> shows only title and author by default", async () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "https://example.com/test-blog",
    likes: 0,
    user: {
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };

  render(<Blog blog={blog} user={user} />);

  // Verificar que el título y el autor se muestran por defecto
  expect(screen.getByText("Test Blog Title")).toBeDefined();
  expect(screen.getByText("Test Author")).toBeDefined();

  // Verificar que la URL y los likes no se muestran por defecto
  expect(screen.queryByText("https://example.com/test-blog")).toBeNull();
  expect(screen.queryByText("likes 0")).toBeNull();

  // Simular el clic en el botón "view" para mostrar los detalles
  const viewButton = screen.getByText("view");
  await userEvent.click(viewButton);

  // Verificar que la URL y los likes se muestran después de hacer clic en "view"
  expect(screen.getByText("https://example.com/test-blog")).toBeDefined();
  expect(screen.getByText("likes 0")).toBeDefined();
}); */

test("<Blog /> calls like handler twice when like button is clicked twice", async () => {
  const blog = {
    title: "Titletest",
    author: "Titleauthor",
    id: "66879e7569f26c82be6ca4b5",
    url: "urltest",
    likes: 0,
    user: {
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };
  blogService.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhdSIsImlkIjoiNjY4NzllNDg2OWYyNmM4MmJlNmNhNGIxIiwiaWF0IjoxNzIwNDQ3ODYzfQ.vLi-c-pPgug6_sbiqjr0AjuimWXor1MPvOXb6iQiKWE");
  const updateBlogsMock = vi.fn();

  render(<Blog blog={blog} user={user} updateBlogs={updateBlogsMock} />);

  // Verificar que el título y el autor se muestran correctamente
  expect(screen.getByText(blog.title)).toBeInTheDocument();
  expect(screen.getByText(blog.author)).toBeInTheDocument();

  // Simular el clic en el botón "view" para mostrar los detalles
  const viewButton = screen.getByText("view");
  userEvent.click(viewButton);

  // Simular dos clics en el botón "like"
  const likeButton = screen.getByText("like");
  userEvent.click(likeButton);
  userEvent.click(likeButton);

  // Aserciones sobre la función mock llamada
  expect(updateBlogsMock).toHaveLength(2);
  expect(updateBlogsMock.mock.calls[0][0].likes).toBe(1);
  expect(updateBlogsMock.mock.calls[1][0].likes).toBe(2);
});
