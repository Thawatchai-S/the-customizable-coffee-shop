import { Router } from 'express';
import { buildDrinkHandler } from './drinks.controller.js';

export const drinksRouter = Router();

drinksRouter.post('/drinks', buildDrinkHandler);
