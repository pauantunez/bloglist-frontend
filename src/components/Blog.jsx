import React, { useState } from "react";

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author} <button onClick={handleToggleDetails}>{showDetails ? "hide" : "view"}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={() => console.log("like button clicked")}>like</button>
          </p>
          <p>added by {blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
