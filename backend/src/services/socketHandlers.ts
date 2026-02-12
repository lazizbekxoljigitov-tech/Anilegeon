import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface User {
  id: string;
  username: string;
  avatar: string;
  roomId?: string;
  socketId: string;
}

// In-memory storage (replace with Redis in production)
const users: Record<string, User> = {};
const rooms: Record<string, string[]> = {}; // roomId -> userIds[]

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join Room
    socket.on('room:join', ({ roomId, user }: { roomId: string; user: Omit<User, 'socketId' | 'roomId'> }) => {
      // Leave previous room if any
      if (users[socket.id]?.roomId) {
        socket.leave(users[socket.id].roomId!);
      }

      // Store user info
      users[socket.id] = { ...user, roomId, socketId: socket.id };
      
      // Add to room
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = [];
      if (!rooms[roomId].includes(user.id)) rooms[roomId].push(user.id);

      // Notify others in room
      socket.to(roomId).emit('room:user_joined', user);
      
      logger.info(`User ${user.username} joined room ${roomId}`);
    });

    // Chat Message
    socket.on('chat:message', (message: any) => {
      const user = users[socket.id];
      if (!user || !user.roomId) return;

      // Broadcast to room (including sender for simplicity, or exclude sender if handled optimistic UI)
      io.to(user.roomId).emit('chat:message', {
        ...message,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        timestamp: new Date().toISOString(),
      });
    });

    // Video/Audio Signal (WebRTC Signaling)
    socket.on('signal', ({ to, signal }) => {
      io.to(to).emit('signal', { from: socket.id, signal });
    });

    // PeerJS ID Exchange
    socket.on('peer:id', (peerId: string) => {
      const user = users[socket.id];
      if (!user || !user.roomId) return;
      
      socket.to(user.roomId).emit('peer:connected', {
        userId: user.id,
        peerId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user && user.roomId) {
        // Remove from room list
        rooms[user.roomId] = rooms[user.roomId]?.filter(id => id !== user.id) || [];
        
        // Notify others
        socket.to(user.roomId).emit('room:user_left', user.id);
        logger.info(`User ${user.username} left room ${user.roomId}`);
      }
      delete users[socket.id];
    });
  });
};
