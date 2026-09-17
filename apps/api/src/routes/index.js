import { Router } from 'express';
import { healthRouter } from '../modules/health/infrastructure/http/health.routes.js';
import { masterDataRouter } from '../modules/master-data/infrastructure/http/master-data.routes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(masterDataRouter);
