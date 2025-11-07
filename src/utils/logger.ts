import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { config } from '../config';

const { combine, timestamp, printf, colorize, align, json } = winston.format;

// Log directory
const logDir = path.join(process.cwd(), 'logs');

// Define log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  const stackString = stack ? `\n${stack}` : '';
  return `${timestamp} ${level}: ${message}${metaString}${stackString}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    config.nodeEnv === 'production' ? json() : combine(colorize(), align(), logFormat)
  ),
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: path.join(logDir, 'error'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.DailyRotateFile({
      dirname: path.join(logDir, 'combined'),
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  exitOnError: false,
});

// If we're not in production, log to the console as well
if (config.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), align(), logFormat),
    })
  );
}

// Create a stream for Morgan to use with Winston
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Log unhandled exceptions
const exceptionHandlers: winston.transport[] = [
  new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
];

if (config.nodeEnv !== 'production') {
  exceptionHandlers.push(
    new winston.transports.Console({ format: combine(colorize(), align(), logFormat) })
  );
}

logger.exceptions.handle(...exceptionHandlers);

export { logger, stream };

// Example usage:
// logger.error('Error message', { error: err });
// logger.warn('Warning message');
// logger.info('Info message', { key: 'value' });
// logger.debug('Debug message', { data: someData });
