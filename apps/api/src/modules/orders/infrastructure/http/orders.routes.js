import { Router } from 'express';
import { placeOrderHandler } from './orders.controller.js';

export const ordersRouter = Router();

ordersRouter.post('/orders', placeOrderHandler);
