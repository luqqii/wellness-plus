import { Server } from 'socket.io';
import env from './env.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // In a real application, you'd verify JWT here or let client pass User ID
    socket.on('register', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} registered for sockets`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

/**
 * Helper to emit a notification to a specific user
 */
export const emitNotification = (userId, type, payload) => {
  if (io) {
    io.to(userId).emit('notification', { type, payload, timestamp: new Date() });
  }
};
