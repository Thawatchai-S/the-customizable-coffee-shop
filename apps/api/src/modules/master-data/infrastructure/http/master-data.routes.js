import { Router } from 'express';
import { getMasterDataHandler } from './master-data.controller.js';

export const masterDataRouter = Router();

masterDataRouter.get('/master-data', getMasterDataHandler);
