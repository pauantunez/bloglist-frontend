import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({ message: `Welcome ${user.name}!`, type: "success" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    } catch (exception) {
      setNotification({ message: "Wrong credentials", type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
    setNotification({ message: "Logged out successfully", type: "success" });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNotification({ message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: "success" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    } catch (exception) {
      setNotification({ message: "Error creating blog", type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const updateBlogs = (updatedBlog) => {
    const updatedBlogs = blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog));
    updatedBlogs.sort((a, b) => b.likes - a.likes);
    setBlogs(updatedBlogs);
  };

  const handleVote = async (blog) => {
    console.log("updating", blog);
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    updateBlogs(updatedBlog);
  };

  const removeBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    setNotification({ message: "Blog removed successfully", type: "success" });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} handleVote={handleVote} removeBlog={removeBlog} user={user} />
      ))}
    </div>
  );

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {!user ? loginForm() : blogList()}
    </div>
  );
};

export default App;
