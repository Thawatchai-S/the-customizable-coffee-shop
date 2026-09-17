import winston from 'winston';
import { env } from '../../config/env.js';

const { combine, timestamp, errors, printf, colorize } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return `${ts} ${level}: ${stack ?? message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), winston.format.json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});
