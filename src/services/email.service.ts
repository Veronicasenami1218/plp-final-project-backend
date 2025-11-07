import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Stub email service - integrate real provider later (e.g., SendGrid, SES)
export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  // For now, just log to avoid leaking PII to third-party until configured
  logger.info(`Email queued: ${subject} -> ${to}`);
  logger.debug(html);
};
