import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware';
import { UserRole } from '../types';
import * as authController from '../controllers/auth.controller';

const router = Router();

// User registration
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role')
      .optional()
      .isIn([UserRole.USER, UserRole.THERAPIST])
      .withMessage('Invalid user role'),
    body('phoneNumber')
      .optional()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage('Invalid phone number format'),
  ],
  validateRequest,
  authController.register
);

// User login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Refresh access token
router.post(
  '/refresh-token',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validateRequest,
  authController.refreshToken
);

// Logout
router.post(
  '/logout',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validateRequest,
  authController.logout
);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  validateRequest,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  authController.resetPassword
);

// Verify email
router.get(
  '/verify-email/:token',
  authController.verifyEmail
);

// Resend verification email
router.post(
  '/resend-verification',
  [body('email').isEmail().withMessage('Valid email is required')],
  validateRequest,
  authController.resendVerificationEmail
);

export default router;
