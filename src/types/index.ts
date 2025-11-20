// User roles
export enum UserRole {
  USER = 'user',
  THERAPIST = 'therapist',
  ADMIN = 'admin',
}

// User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

// Gender options
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

// Supported countries
export enum Country {
  NIGERIA = 'Nigeria',
  GHANA = 'Ghana',
  KENYA = 'Kenya',
  SOUTH_AFRICA = 'South Africa',
  OTHER = 'Other',
}

// Session status
export enum SessionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

// Message status
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

// Message types
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

// Appointment types
export enum AppointmentType {
  VIDEO_CALL = 'video_call',
  AUDIO_CALL = 'audio_call',
  IN_PERSON = 'in_person',
  CHAT = 'chat',
}

// Notification types
export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  MESSAGE_RECEIVED = 'message_received',
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
  APPOINTMENT_CANCELLATION = 'appointment_cancellation',
  SYSTEM_ALERT = 'system_alert',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

// Therapist specialization
export enum TherapistSpecialization {
  CLINICAL_PSYCHOLOGY = 'clinical_psychology',
  COUNSELING_PSYCHOLOGY = 'counseling_psychology',
  PSYCHIATRY = 'psychiatry',
  CHILD_PSYCHOLOGY = 'child_psychology',
  FORENSIC_PSYCHOLOGY = 'forensic_psychology',
  HEALTH_PSYCHOLOGY = 'health_psychology',
  NEUROPSYCHOLOGY = 'neuropsychology',
  SCHOOL_PSYCHOLOGY = 'school_psychology',
  SPORTS_PSYCHOLOGY = 'sports_psychology',
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  timezone: string;
}

// Base document interface
export interface BaseDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

// Pagination interface
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Generic response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// JWT payload
export interface JwtPayload {
  userId: string;
  role: UserRole;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

// Request with user
export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: UserRole;
    sessionId?: string;
  };
}

// File upload options
export interface FileUploadOptions {
  fieldName: string;
  allowedMimeTypes: string[];
  maxSize: number; // in bytes
  destination: string;
  // Avoid tight coupling to multer types; use loose typing here.
  fileName?: (file: any) => string;
  fileFilter?: (file: any) => boolean;
}

// Environment type
export type Environment = 'development' | 'production' | 'test';

// Cache options
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  prefix?: string;
}
