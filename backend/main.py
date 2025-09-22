from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.history: list[str] = []  # Store chat history
        self.active_usernames: set[str] = set()
        
    async def connect(self, websocket: WebSocket, username: str):
        if username in self.active_usernames:
            await websocket.accept()
            await websocket.send_text("ERROR:USERNAME_TAKEN")
            await websocket.close(code=4001)  # Close connection if username is taken
            return False
        await websocket.accept()
        self.active_connections.append(websocket)
        self.active_usernames.add(username)
        for msg in self.history:
            await websocket.send_text(msg)  # Send chat history to new connection
        return True

    def disconnect(self, websocket: WebSocket, username: str):
        self.active_connections.remove(websocket)
        self.active_usernames.remove(username)
        #self.history.clear()  # Clear history when a user disconnects

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, add_to_history=True):
        if add_to_history:            
            self.history.append(message)  # Save message to history
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    username = websocket.query_params.get("username", "Anonymous")
    connected = await manager.connect(websocket, username)
    
    if not connected:
        return
    await manager.broadcast(f"🟢 {username} joined the chat", add_to_history=False)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                user = payload.get("username", "Anonymous")
                msg = payload.get("message", "")
                await manager.broadcast(f"{user}: {msg}")
            except Exception:
                await manager.broadcast(data, add_to_history=True)
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)
        if manager.active_connections:
            await manager.broadcast(f"🔴 {username} left the chat",add_to_history=False)