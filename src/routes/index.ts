import express, { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

// Health check route (removed - handled in server.ts middleware)

// Auth routes
import authRoutes from './auth.routes';
router.use('/auth', authRoutes);

// User routes
import userRoutes from './user.routes';
router.use('/users', authenticate, userRoutes);

// Therapist routes
import therapistRoutes from './therapist.routes';
router.use('/therapists', authenticate, therapistRoutes);

// Admin routes
import adminRoutes from './admin.routes';
router.use('/admin', authenticate, authorize([UserRole.ADMIN]), adminRoutes);

// Session routes
import sessionRoutes from './session.routes';
router.use('/sessions', authenticate, sessionRoutes);

// Message routes
import messageRoutes from './message.routes';
router.use('/messages', authenticate, messageRoutes);

// Appointment routes
import appointmentRoutes from './appointment.routes';
router.use('/appointments', authenticate, appointmentRoutes);

// Notification routes
import notificationRoutes from './notification.routes';
router.use('/notifications', authenticate, notificationRoutes);

// Export the router
const registerRoutes = (app: express.Application) => {
  app.use('/api/v1', router);
};

export { registerRoutes };

export default router;
