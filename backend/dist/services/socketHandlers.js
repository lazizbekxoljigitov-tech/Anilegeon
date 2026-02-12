"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const logger_1 = require("../utils/logger");
// In-memory storage (replace with Redis in production)
const users = {};
const rooms = {}; // roomId -> userIds[]
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        logger_1.logger.info(`User connected: ${socket.id}`);
        // Join Room
        socket.on('room:join', ({ roomId, user }) => {
            // Leave previous room if any
            if (users[socket.id]?.roomId) {
                socket.leave(users[socket.id].roomId);
            }
            // Store user info
            users[socket.id] = { ...user, roomId, socketId: socket.id };
            // Add to room
            socket.join(roomId);
            if (!rooms[roomId])
                rooms[roomId] = [];
            if (!rooms[roomId].includes(user.id))
                rooms[roomId].push(user.id);
            // Notify others in room
            socket.to(roomId).emit('room:user_joined', user);
            logger_1.logger.info(`User ${user.username} joined room ${roomId}`);
        });
        // Chat Message
        socket.on('chat:message', (message) => {
            const user = users[socket.id];
            if (!user || !user.roomId)
                return;
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
        socket.on('peer:id', (peerId) => {
            const user = users[socket.id];
            if (!user || !user.roomId)
                return;
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
                logger_1.logger.info(`User ${user.username} left room ${user.roomId}`);
            }
            delete users[socket.id];
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
//# sourceMappingURL=socketHandlers.js.map