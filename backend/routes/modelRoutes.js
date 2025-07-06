// routes/modelRoutes.js

import express from 'express';
import { listProviders, getProviderModels } from '../controllers/modelController.js';

const router = express.Router();

router.get('/providers', listProviders);
router.post('/:provider/models', getProviderModels);

export default router;
