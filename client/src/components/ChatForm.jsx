import React, { useState } from "react";
import "../css/index.css";

function ChatForm({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="chat-form-container">
      <form onSubmit={handleSubmit}>
        <div className="chat-input-container mb-3">
          <button className="sendButton" type="submit">
            <i className="bi bi-send-fill"></i>
          </button>
          <textarea
            className="chat-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            onKeyDown={handleKeyDown}
            style={{ focus: { border: "none", boxShadow: "none" } }}
          />
        </div>
      </form>
    </div>
  );
}
export default ChatForm;
