import { useEffect, useState, useRef } from "react";
import Username from "./Username";
import ChatBox from "./ChatBox";
import ChatForm from "./ChatForm";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const clientId = useRef(Math.floor(Math.random() * 1000000));
  const ws = useRef(null);

  useEffect(() => {
    if (!usernameSubmitted) return;

    const socket = new WebSocket(
      `ws://${process.env.REACT_APP_API_URL}${
        process.env.REACT_APP_SOCKET_PATH
      }/${clientId.current}?username=${encodeURIComponent(username)}`
    );
    ws.current = socket;

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);

    socket.onmessage = (event) => {
      if (event.data === "ERROR:USERNAME_TAKEN") {
        setUsernameError("Username already in use. Please choose another.");
        setUsernameSubmitted(false); // Stay on the username form
        setUsername(""); // Optionally clear the username field
        socket.close();
        return;
      }
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      socket.close();
    };
  }, [usernameSubmitted, username]);

  const handleUsernameSubmit = (name) => {
    setUsernameError(""); // Clear previous error
    setUsername(name);
    setUsernameSubmitted(true);
  };

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ username, message }));
    } else {
      alert("WebSocket not connected yet!");
    }
  };

  if (!usernameSubmitted) {
    return (
      <Username
        onSubmit={handleUsernameSubmit}
        message={usernameError}
        value={username}
      />
    );
  }

  const logout = () => {
    if (ws.current) {
      ws.current.close();
    }
    setMessages([]);
    setUsername("");
    setUsernameSubmitted(false);
    setUsernameError("");
  };

  return (
    <>
      <div className="chat-username-bar">
        <span>
          Logged in as: <strong>{username}</strong>
        </span>
        <button className="logout-button" onClick={logout}>
          <i className="bi bi-box-arrow-left"></i>&nbsp;Logout
        </button>
      </div>
      <ChatBox messages={messages} />
      <ChatForm onSendMessage={sendMessage} disabled={!isReady} />
    </>
  );
}

export default Chat;
