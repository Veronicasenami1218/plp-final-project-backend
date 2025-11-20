/**
 * Email templates for MentWel platform
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  /**
   * Email verification template
   */
  verifyEmail: (verificationUrl: string, firstName: string): EmailTemplate => ({
    subject: 'Verify Your Email - MentWel',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to MentWel</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Thank you for registering with MentWel. Please verify your email address to complete your registration.</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with MentWel, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 MentWel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${firstName},\n\nThank you for registering with MentWel. Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account with MentWel, please ignore this email.\n\n© 2025 MentWel. All rights reserved.`,
  }),

  /**
   * Password reset template
   */
  resetPassword: (resetUrl: string, firstName: string): EmailTemplate => ({
    subject: 'Reset Your Password - MentWel',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your password for your MentWel account.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 10 minutes for your security.
              </div>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 MentWel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${firstName},\n\nWe received a request to reset your password for your MentWel account.\n\nClick the link below to reset your password:\n\n${resetUrl}\n\n⚠️ This link will expire in 10 minutes for your security.\n\nIf you didn't request a password reset, please ignore this email.\n\n© 2025 MentWel. All rights reserved.`,
  }),

  /**
   * Welcome email after verification
   */
  welcome: (firstName: string): EmailTemplate => ({
    subject: 'Welcome to MentWel - Your Mental Health Journey Starts Here',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .feature { margin: 15px 0; padding: 15px; background-color: white; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to MentWel! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Your email has been verified successfully! We're excited to have you join our community.</p>
              <h3>What's Next?</h3>
              <div class="feature">
                <strong>🔍 Find a Therapist</strong>
                <p>Browse our network of qualified mental health professionals.</p>
              </div>
              <div class="feature">
                <strong>📅 Book Sessions</strong>
                <p>Schedule appointments at your convenience.</p>
              </div>
              <div class="feature">
                <strong>💬 Secure Messaging</strong>
                <p>Communicate safely with your therapist.</p>
              </div>
              <p>Your privacy and security are our top priorities. All communications are encrypted and confidential.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 MentWel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${firstName},\n\nYour email has been verified successfully! We're excited to have you join our community.\n\nWhat's Next?\n\n🔍 Find a Therapist - Browse our network of qualified mental health professionals.\n📅 Book Sessions - Schedule appointments at your convenience.\n💬 Secure Messaging - Communicate safely with your therapist.\n\nYour privacy and security are our top priorities.\n\n© 2025 MentWel. All rights reserved.`,
  }),
};
