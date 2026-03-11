# ⚡ react-fastapi-chat

> A real-time chat room application powered by **React** and **FastAPI**, communicating over **WebSockets** for instant, bidirectional messaging with username support.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)

---

## 🔍 Overview

`react-fastapi-chat` is a lightweight, full-stack chat room application that demonstrates real-time communication using the **WebSocket protocol**. Users join a shared chat room under a chosen username and can send/receive messages instantly — no polling, no page refreshes.

This project is a great reference for understanding how to wire together a **Python async backend** with a **modern React frontend** over a persistent WebSocket connection.

---

## ✨ Features

- 🔴 **Real-time messaging** — Messages are pushed instantly via WebSocket, with zero latency overhead from HTTP polling
- 👤 **Username support** — Each user identifies themselves with a custom username visible in the chat
- 🌐 **Shared chat room** — All connected users participate in the same room and see each other's messages live
- ⚡ **Async Python backend** — FastAPI with `uvicorn` handles concurrent WebSocket connections efficiently
- ⚛️ **React frontend** — Clean, reactive UI that updates in real time as messages arrive

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React)                   │
│                                                     │
│   User types message → WebSocket.send(msg)          │
│   WebSocket.onmessage → updates chat UI             │
└───────────────────────┬─────────────────────────────┘
                        │  ws://localhost:8000/ws/{username}
                        │  (persistent WebSocket connection)
┌───────────────────────▼─────────────────────────────┐
│               FastAPI Backend (Uvicorn)              │
│                                                     │
│   ConnectionManager                                 │
│   ├── accept() new connections                      │
│   ├── broadcast() messages to all active clients    │
│   └── disconnect() on client close / error          │
└─────────────────────────────────────────────────────┘
```

**Communication flow:**
1. React app opens a WebSocket connection to the FastAPI server, passing the username in the URL
2. FastAPI registers the connection in a `ConnectionManager`
3. When a user sends a message, FastAPI broadcasts it to **all** connected clients
4. React receives the broadcasted message via `onmessage` and renders it in the chat window

---

## 📁 Project Structure

```
react-fastapi-chat/
├── backend/
│   ├── main.py          # FastAPI app — WebSocket endpoint & ConnectionManager
│   └── requirements.txt # Python dependencies (fastapi, uvicorn, websockets)
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js       # Root component — username entry & chat routing
│   │   ├── Chat.js      # Chat room UI — WebSocket client logic
│   │   └── index.js     # React entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.8+ |
| Node.js | 14+ |
| npm | 6+ |

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. (Recommended) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install fastapi uvicorn websockets

# 4. Start the server
uvicorn main:app --reload
```

The FastAPI server will be running at **`http://localhost:8000`**  
WebSocket endpoint: **`ws://localhost:8000/ws/{username}`**

> **Tip:** Visit `http://localhost:8000/docs` for the auto-generated Swagger UI.

---

### Frontend Setup

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The React app will open at **`http://localhost:3000`**

---

## ⚙️ How It Works

### Backend — `ConnectionManager` pattern

FastAPI manages all active WebSocket connections through a `ConnectionManager` class:

```python
# Conceptual overview of the backend pattern
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{username}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"{username} has left the chat")
```

### Frontend — WebSocket client in React

The React client opens a persistent connection and listens for incoming messages:

```js
// Conceptual overview of the React WebSocket usage
const ws = new WebSocket(`ws://localhost:8000/ws/${username}`);

ws.onmessage = (event) => {
  setMessages(prev => [...prev, event.data]);
};

const sendMessage = (text) => {
  ws.send(text);
};
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React | Component-based UI |
| **Communication** | WebSocket API | Real-time bidirectional messaging |
| **Backend** | FastAPI | Async Python web framework |
| **Server** | Uvicorn | ASGI server for FastAPI |
| **Protocol** | websockets (Python lib) | WebSocket support |

---

## 🤝 Contributing

Contributions are welcome! Here are a few ideas to extend this project:

- 🔒 Add authentication (JWT tokens on WebSocket handshake)
- 🗄️ Persist message history with a database (SQLite / PostgreSQL)
- 🏠 Support multiple chat rooms
- 📦 Dockerize both services with `docker-compose`
- 🧪 Add unit tests for the `ConnectionManager`

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request 🎉
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/GuiRibeiro03">GuiRibeiro03</a>
</p>
