import fetch from 'node-fetch';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { RECAPTCHA_SECRET } from '../config';

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body?.recaptchaToken as string | undefined;
    if (!RECAPTCHA_SECRET) {
      // If not configured, allow in dev/test but log a warning
      logger.warn('RECAPTCHA_SECRET not set; skipping reCAPTCHA verification');
      return next();
    }
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing reCAPTCHA token',
      });
    }

    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET);
    params.append('response', token);
    if (req.ip) params.append('remoteip', req.ip);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = (await resp.json()) as { success: boolean; score?: number; action?: string; [k: string]: any };

    if (!data.success) {
      logger.info('reCAPTCHA verification failed', { ip: req.ip, data });
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    // reCAPTCHA v3: optionally enforce score threshold
    if (typeof data.score === 'number' && data.score < 0.3) {
      logger.info('reCAPTCHA low score blocked', { ip: req.ip, score: data.score });
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Suspicious activity detected' });
    }

    next();
  } catch (err) {
    logger.error('reCAPTCHA verification error', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'reCAPTCHA check error' });
  }
};
