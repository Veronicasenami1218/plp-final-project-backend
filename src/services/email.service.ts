import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mentwel.com';
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';

// Create transporter
let transporter: nodemailer.Transporter | null = null;

const createTransporter = () => {
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    logger.warn('Email service not configured. Emails will be logged only.');
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

// Initialize transporter
transporter = createTransporter();

/**
 * Send email using configured provider
 */
export const sendEmail = async ({ to, subject, html, text }: EmailOptions): Promise<void> => {
  try {
    // If transporter is not configured, just log
    if (!transporter) {
      logger.info(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
      logger.debug(`[EMAIL STUB] Content: ${html}`);
      return;
    }

    // Send email
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    logger.info(`Email sent successfully to ${to}`, { messageId: info.messageId });
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};
