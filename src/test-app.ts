import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { errorHandler } from './middleware/error.middleware';
import { stream } from './utils/logger';

const expressApp = express();

expressApp.use(helmet());
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(compression());
expressApp.use(morgan('dev', { stream }));

// Health check for tests
expressApp.get('/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

// Attach error handler last
expressApp.use(errorHandler);

export { expressApp };
