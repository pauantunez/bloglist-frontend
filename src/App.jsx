import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification"; // Import the Notification component

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const handleBlogCreation = async (event) => {
    event.preventDefault();
    try {
      blogService.create(newBlog).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNewBlog({ title: "", author: "", url: "" });
        setNotification({ message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: "success" });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
      });
    } catch (exception) {
      setNotification({ message: "Error creating blog", type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  const handleBlogChange = ({ target }) => {
    const { name, value } = target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
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

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleBlogCreation}>
        <div>
          title
          <input type="text" value={newBlog.title} name="title" onChange={handleBlogChange} />
        </div>
        <div>
          author
          <input type="text" value={newBlog.author} name="author" onChange={handleBlogChange} />
        </div>
        <div>
          url
          <input type="text" value={newBlog.url} name="url" onChange={handleBlogChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
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
