import swaggerJSDoc, { type Options } from 'swagger-jsdoc';
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
    { name: 'Users', description: 'User operations (RBAC enforced)' },
    { name: 'Therapists', description: 'Therapist operations (RBAC enforced)' },
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
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phoneNumber: { type: 'string' },
          role: { type: 'string', enum: ['user', 'therapist'] },
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          409: { description: 'Email already in use' },
        },
      },
    },
    '/api/v1/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        responses: {
          200: { description: 'New access token issued' },
          401: { description: 'Invalid refresh token' },
        },
      },
    },
  },
};

const options: Options = {
  definition: swaggerDefinition as any,
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
