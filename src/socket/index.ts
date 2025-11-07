import { Server } from 'socket.io';
import { logger } from '../utils/logger';

export const initializeSocket = (io: Server) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};
