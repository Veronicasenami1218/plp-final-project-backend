import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware';
import { UserRole, Gender, Country } from '../types';
import * as authController from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';
import { verifyRecaptcha } from '../middleware/recaptcha.middleware';

const router = Router();

// Rate limit: 5 attempts/hour/IP for registration
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });

// User registration (email or phone)
router.post(
  '/register',
  registerLimiter,
  [
    oneOf([
      body('email').isEmail().withMessage('Valid email is required'),
      body('phoneNumber')
        .matches(/^\+234[789][01]\d{8}$/)
        .withMessage('Valid Nigerian phone number is required (format: +234XXXXXXXXX, 11 digits total)'),
    ], { message: 'Either a valid email or phone number is required' }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least one special character'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isISO8601().toDate().withMessage('Valid date of birth is required'),
    body('gender')
      .isIn(Object.values(Gender))
      .withMessage('Gender must be one of: male, female, other, prefer_not_to_say'),
    body('country')
      .optional()
      .isIn(Object.values(Country))
      .withMessage('Country must be one of: Nigeria, Ghana, Kenya, South Africa, Other'),
    body('acceptTerms').equals('true').withMessage('You must accept the Terms of Service and Privacy Policy'),
    body('role')
      .optional()
      .isIn([UserRole.USER, UserRole.THERAPIST])
      .withMessage('Invalid user role'),
    body('recaptchaToken').optional().isString(),
  ],
  verifyRecaptcha,
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
