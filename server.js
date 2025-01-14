import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 靜態文件服務
app.use(express.static(path.join(__dirname, 'dist')));

// 存儲連接的用戶
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('用戶連接:', socket.id);
  
  // 當用戶加入時
  socket.on('user-connected', (userData) => {
    connectedUsers.set(socket.id, {
      id: socket.id,
      position: userData.position || { x: 0, y: 1.6, z: 0 },
      rotation: userData.rotation || { x: 0, y: 0, z: 0 }
    });
    
    // 廣播給其他用戶
    socket.broadcast.emit('user-joined', {
      id: socket.id,
      position: connectedUsers.get(socket.id).position,
      rotation: connectedUsers.get(socket.id).rotation
    });
    
    // 發送現有用戶列表給新用戶
    const existingUsers = Array.from(connectedUsers.entries())
      .filter(([id]) => id !== socket.id)
      .map(([id, data]) => ({ id, ...data }));
    socket.emit('existing-users', existingUsers);
  });
  
  // 當用戶更新位置時
  socket.on('position-update', (data) => {
    if (connectedUsers.has(socket.id)) {
      connectedUsers.get(socket.id).position = data.position;
      connectedUsers.get(socket.id).rotation = data.rotation;
      socket.broadcast.emit('user-moved', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });
  
  // 當用戶斷開連接時
  socket.on('disconnect', () => {
    console.log('用戶斷開連接:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('user-disconnected', socket.id);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
}); 