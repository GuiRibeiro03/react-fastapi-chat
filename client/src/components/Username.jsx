import React, { useEffect,useState } from "react";
import "../css/index.css";

function Username({ onSubmit, message,value }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(value || "");
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() !== "") {
      onSubmit(username);
    }
  };

  return (
    <div className="username-form">
      <form onSubmit={handleSubmit}>
        {message && <div className="username-error">{message}</div>}
        <input
          className="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button className="username-button" type="submit">
          Join <i className="bi bi-box-arrow-in-right"></i>
        </button>
      </form>
    </div>
  );
}

export default Username;
