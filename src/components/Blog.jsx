import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlogs, removeBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlogs(returnedBlog);
    } catch (error) {
      console.error("Error updating blog:", error.message);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (error) {
        console.error("Error removing blog:", error.message);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        <strong className="blog-title">{blog.title}</strong> by <span className="blog-author">{blog.author}</span>
        <button onClick={handleToggleDetails}>{showDetails ? "hide" : "view"}</button>
      </div>
      {showDetails && (
        <div>
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p className="blog-user">added by {blog.user.username}</p>
          {blog.user.username === user.username && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
