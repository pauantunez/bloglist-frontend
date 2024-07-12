import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleBlogChange = ({ target }) => {
    const { name, value } = target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({
      title: "",
      author: "",
      url: "",
    });
  };

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>Title:</label>
          <input type="text" data-testid="title-input" name="title" value={newBlog.title} onChange={handleBlogChange} />
        </div>
        <div>
          <label>URL:</label>
          <input type="text" data-testid="author-input" name="author" value={newBlog.author} onChange={handleBlogChange} />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" data-testid="url-input" name="url" value={newBlog.url} onChange={handleBlogChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
