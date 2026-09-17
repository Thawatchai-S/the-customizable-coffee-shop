import { logger } from '../logger/index.js';
import { AppError } from '../errors/AppError.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  if (!isAppError) {
    logger.error(err);
  }

  res.status(statusCode).json({
    error: {
      name: err.name ?? 'Error',
      message: err.message ?? 'Internal server error',
      ...(err.issues ? { issues: err.issues } : {}),
    },
  });
}
