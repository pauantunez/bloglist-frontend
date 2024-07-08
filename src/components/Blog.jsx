import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlogs }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author} <button onClick={handleToggleDetails}>{showDetails ? "hide" : "view"}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>added by {blog.author}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
