function ChatBox({ messages }) {
  return (
    <div className="chat-container">
      <div className="chat-box">
        <ul className="chat-messages">
          {messages.length === 0 ? (
            <p className="chat-placeholder">
              Chat messages will appear here...
            </p>
          ) : (
            messages.map((msg, index) => <li key={index}>{msg}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
export default ChatBox;