import express from 'express';
import { apiRouter } from './routes/index.js';
import { notFound } from './shared/middlewares/notFound.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
