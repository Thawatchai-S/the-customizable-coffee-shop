import { Router } from 'express';
import { healthRouter } from '../modules/health/infrastructure/http/health.routes.js';
import { masterDataRouter } from '../modules/master-data/infrastructure/http/master-data.routes.js';
import { drinksRouter } from '../modules/drinks/infrastructure/http/drinks.routes.js';
import { ordersRouter } from '../modules/orders/infrastructure/http/orders.routes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(masterDataRouter);
apiRouter.use(drinksRouter);
apiRouter.use(ordersRouter);
