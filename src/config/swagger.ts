import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, SERVER_URL } from './index';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'MentWel API',
    description: `
# MentWel Digital Mental Health Platform API

A secure, production-ready REST API for mental health services with comprehensive authentication and user management.

## 🚀 Current Status
- **Live Production URL:** https://plp-final-project-backend.onrender.com
- **Authentication System:** ✅ Fully Implemented
- **User Registration:** ✅ With Nigerian phone validation, gender/country selection
- **Email Verification:** ✅ With graceful fallback support
- **Security Features:** ✅ JWT auth, rate limiting, CORS, helmet protection

## 📋 Available Endpoints
- **Authentication:** Complete user registration, login, password reset, email verification
- **Health Check:** System monitoring and status
- **Future Modules:** User profiles, therapist management, sessions, messaging, appointments

## 🔐 Security Features
- Rate limiting (5 registration attempts/hour)
- JWT token authentication with refresh tokens
- Nigerian phone number validation (+234XXXXXXXXX)
- Password complexity requirements
- Age verification (18+ only)
- Email verification with fallback support
- CORS and security headers enabled

## 🌍 Supported Regions
- Primary: Nigeria (with local phone validation)
- Additional: Ghana, Kenya, South Africa
    `,
    version: '1.0.0',
    contact: {
      name: 'MentWel Team',
      url: 'https://plp-final-project-backend.onrender.com',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'https://plp-final-project-backend.onrender.com',
      description: 'Production server (Live)',
    },
    {
      url: 'http://localhost:5000',
      description: 'Development server (Local)',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check and system diagnostics' },
    { name: 'Auth', description: 'User authentication, registration, and token management with email verification fallback' },
    { name: 'Users', description: 'User profile operations (Coming Soon)' },
    { name: 'Therapists', description: 'Therapist management operations (Coming Soon)' },
    { name: 'Sessions', description: 'Therapy sessions management (Coming Soon)' },
    { name: 'Messages', description: 'Real-time messaging and history (Coming Soon)' },
    { name: 'Appointments', description: 'Appointment scheduling and management (Coming Soon)' },
    { name: 'Notifications', description: 'User notifications system (Coming Soon)' },
    { name: 'Admin', description: 'Administrative operations (Coming Soon)' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['password', 'confirmPassword', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'acceptTerms'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email', 
            example: 'user@example.com',
            description: 'Valid email address. Provide either email OR phoneNumber (not both).' 
          },
          phoneNumber: { 
            type: 'string', 
            format: 'phone',
            pattern: '^\\+234[789][01]\\d{8}$',
            example: '+2348012345678',
            description: 'Valid Nigerian phone number with country code +234 (11 digits total). Format: +234XXXXXXXXX. Provide either email OR phoneNumber (not both).' 
          },
          password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$',
            example: 'SecurePass123!',
            description: 'Password must be at least 8 characters with: 1 uppercase, 1 lowercase, 1 number, 1 special character',
          },
          confirmPassword: {
            type: 'string',
            minLength: 8,
            example: 'SecurePass123!',
            description: 'Must match the password field exactly. Used to prevent password entry errors.',
          },
          firstName: { 
            type: 'string', 
            example: 'John',
            description: 'User first name'
          },
          lastName: { 
            type: 'string', 
            example: 'Doe',
            description: 'User last name'
          },
          dateOfBirth: { 
            type: 'string', 
            format: 'date', 
            example: '1990-01-01',
            description: 'Date of birth in YYYY-MM-DD format. User must be 18 or older.'
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            description: 'User gender selection (required)',
            example: 'male'
          },
          country: {
            type: 'string',
            enum: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other'],
            default: 'Nigeria',
            description: 'Country of residence (defaults to Nigeria)',
            example: 'Nigeria'
          },
          role: {
            type: 'string',
            enum: ['user', 'therapist'],
            default: 'user',
            description: 'User role - defaults to user for regular users, set to therapist for mental health professionals'
          },
          acceptTerms: { 
            type: 'boolean', 
            example: true, 
            description: 'Must be true to accept Terms of Service and Privacy Policy (required)' 
          },
          recaptchaToken: { 
            type: 'string', 
            description: 'reCAPTCHA v3 token for bot protection (optional in development)' 
          },
        },
        description: 'User registration requires either email OR phoneNumber (not both), along with all other required fields.',
        additionalProperties: false
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: { refreshToken: { type: 'string' } },
      },
      LogoutRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: { refreshToken: { type: 'string' } },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 },
        },
      },
      ResendVerificationRequest: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
          phoneNumber: { type: 'string', example: '+2348012345678' },
          isPhoneVerified: { type: 'boolean', example: false },
          isEmailVerified: { type: 'boolean', example: true },
          status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'pending_verification'], example: 'active' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
          gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer_not_to_say'], example: 'male' },
          country: { type: 'string', enum: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other'], example: 'Nigeria' },
          acceptedTermsAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          access: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              expiresIn: { type: 'string', example: '15m' },
            },
          },
          refresh: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              expiresIn: { type: 'string', example: '7d' },
            },
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              tokens: { $ref: '#/components/schemas/AuthTokens' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'System health check',
        description: 'Check if the API server is running and responsive. Used for monitoring and load balancer health checks.',
        responses: {
          200: {
            description: 'Server is healthy and operational',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time', example: '2025-11-20T08:00:00.000Z' },
                  },
                },
                examples: {
                  healthyResponse: {
                    summary: 'Healthy server response',
                    value: {
                      status: 'ok',
                      timestamp: '2025-11-20T08:00:00.000Z'
                    }
                  }
                }
              },
            },
          },
          503: {
            description: 'Server is not healthy (database connection issues, etc.)',
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticate user with email and password. Email verification requirement can be bypassed via REQUIRE_EMAIL_VERIFICATION environment variable (currently set to false for development).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
              examples: {
                loginExample: {
                  summary: 'Standard login',
                  value: {
                    email: 'user@example.com',
                    password: 'SecurePass123!'
                  }
                }
              }
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful - Returns user data and JWT tokens',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: { description: 'Invalid email or password' },
          403: { description: 'Email verification required (only if REQUIRE_EMAIL_VERIFICATION=true)' },
          429: { description: 'Too many login attempts - rate limited' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Create a new user account with comprehensive validation. Features: Rate limiting (5/hour), Nigerian phone validation, gender/country selection, email verification with graceful fallback, age verification (18+), and secure password requirements.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
              examples: {
                completeExample: {
                  summary: 'Complete Registration Fields (Choose Email OR Phone)',
                  description: 'Shows all available fields. Use either email OR phoneNumber, not both.',
                  value: {
                    email: 'john.doe@example.com',
                    phoneNumber: '+2348012345678',
                    password: 'SecurePass123!',
                    confirmPassword: 'SecurePass123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    dateOfBirth: '1990-01-01',
                    gender: 'male',
                    country: 'Nigeria',
                    role: 'user',
                    acceptTerms: true,
                    recaptchaToken: 'optional-recaptcha-token'
                  }
                },
                emailOnly: {
                  summary: 'Email Registration',
                  description: 'Register with email address only',
                  value: {
                    email: 'user@example.com',
                    password: 'SecurePass123!',
                    confirmPassword: 'SecurePass123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    dateOfBirth: '1990-01-01',
                    gender: 'male',
                    country: 'Nigeria',
                    acceptTerms: true
                  }
                },
                phoneOnly: {
                  summary: 'Phone Registration',
                  description: 'Register with Nigerian phone number only',
                  value: {
                    phoneNumber: '+2348012345678',
                    password: 'SecurePass123!',
                    confirmPassword: 'SecurePass123!',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    dateOfBirth: '1992-05-15',
                    gender: 'female',
                    country: 'Nigeria',
                    acceptTerms: true
                  }
                },
                therapistExample: {
                  summary: 'Therapist Registration',
                  description: 'Register as a mental health professional',
                  value: {
                    email: 'dr.sarah@clinic.com',
                    password: 'SecurePass123!',
                    confirmPassword: 'SecurePass123!',
                    firstName: 'Dr. Sarah',
                    lastName: 'Johnson',
                    dateOfBirth: '1985-03-15',
                    gender: 'female',
                    country: 'Nigeria',
                    role: 'therapist',
                    acceptTerms: true
                  }
                }
              }
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully - Registration completes even if email verification fails',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: { 
            description: 'Validation errors',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Validation failed' },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string', example: 'phoneNumber' },
                          message: { type: 'string', example: 'Valid Nigerian phone number is required (format: +234XXXXXXXXX, 11 digits total)' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          409: { description: 'Account with provided email or phone already exists' },
          429: { description: 'Rate limit exceeded - 5 registration attempts per hour per IP' },
        },
      },
    },
    '/api/v1/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } } },
        },
        responses: {
          200: { description: 'New access token issued' },
          401: { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user (invalidate refresh token)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LogoutRequest' } } },
        },
        responses: {
          204: { description: 'Logged out' },
        },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
        },
        responses: {
          200: { description: 'If email exists, a reset link will be sent' },
        },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
        },
        responses: {
          200: { description: 'Password reset successful' },
          400: { description: 'Invalid or expired token' },
        },
      },
    },
    '/api/v1/auth/verify-email/{token}': {
      get: {
        tags: ['Auth'],
        summary: 'Verify email',
        parameters: [
          { name: 'token', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          302: { description: 'Redirect to client success/failure page' },
          400: { description: 'Invalid verification token' },
        },
      },
    },
    '/api/v1/auth/resend-verification': {
      post: {
        tags: ['Auth'],
        summary: 'Resend verification email',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ResendVerificationRequest' } } },
        },
        responses: {
          200: { description: 'Verification email sent if account exists and is not verified' },
          400: { description: 'Email already verified' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition as any,
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'],
} as any;

export const swaggerSpec = swaggerJSDoc(options);
