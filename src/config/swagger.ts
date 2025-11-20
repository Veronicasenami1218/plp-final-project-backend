import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, SERVER_URL } from './index';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'MentWel API',
    description: 'Secure, anonymous, versioned API for the MentWel Digital Mental Health Platform',
    version: '1.0.0',
  },
  servers: [
    {
      url: SERVER_URL,
      description: NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check and diagnostics' },
    { name: 'Auth', description: 'Authentication and token management' },
    { name: 'Users', description: 'User operations' },
    { name: 'Therapists', description: 'Therapist operations' },
    { name: 'Sessions', description: 'Therapy sessions management' },
    { name: 'Messages', description: 'Real-time messaging and history (pagination required)' },
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
        required: ['password', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'acceptTerms'],
        properties: {
          email: { type: 'string', format: 'email', description: 'Either email or phoneNumber is required' },
          phoneNumber: { 
            type: 'string', 
            format: 'phone',
            pattern: '^\\+?[1-9]\\d{1,14}$',
            example: '+2348012345678',
            description: 'Valid international phone number (E.164 format recommended). Either email or phoneNumber is required' 
          },
          password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$',
            description: 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character',
          },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            description: 'User gender selection',
            example: 'male'
          },
          country: {
            type: 'string',
            enum: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other'],
            default: 'Nigeria',
            description: 'Country of residence',
            example: 'Nigeria'
          },
          role: {
            type: 'string',
            enum: ['user', 'therapist'],
            default: 'user',
            description: 'User role - defaults to user'
          },
          acceptTerms: { type: 'boolean', example: true, description: 'Must be true to accept Terms of Service and Privacy Policy' },
          recaptchaToken: { type: 'string', description: 'reCAPTCHA v3 token (optional)' },
        },
        oneOf: [
          { required: ['email'] },
          { required: ['phoneNumber'] },
        ],
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
        summary: 'Health check',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticate user with email and password. Email verification may be required based on REQUIRE_EMAIL_VERIFICATION setting.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: { description: 'Invalid credentials' },
          403: { description: 'Email verification required (if REQUIRE_EMAIL_VERIFICATION=true)' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Create a new user account. Rate limited to 5 attempts per hour per IP. reCAPTCHA v3 optional. Requires either email or phone number, plus gender selection and country.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
              examples: {
                emailRegistration: {
                  summary: 'Registration with email',
                  value: {
                    email: 'john.doe@example.com',
                    password: 'SecurePass123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    dateOfBirth: '1990-01-01',
                    gender: 'male',
                    country: 'Nigeria',
                    acceptTerms: true
                  }
                },
                phoneRegistration: {
                  summary: 'Registration with phone',
                  value: {
                    phoneNumber: '+2348012345678',
                    password: 'SecurePass123!',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    dateOfBirth: '1992-05-15',
                    gender: 'female',
                    country: 'Ghana',
                    acceptTerms: true
                  }
                }
              }
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: { description: 'Validation error (password policy, under 18, terms not accepted, invalid gender/country)' },
          409: { description: 'Account with provided email or phone already exists' },
          429: { description: 'Rate limit exceeded (5 attempts per hour)' },
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
