import express from 'express';
import { verifyToken } from '../config/firebase.js';
import {
  createAutomation,
  getUserAutomations,
  deleteAutomation
} from '../controllers/automationController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createAutomation);
router.get('/', getUserAutomations);
router.delete('/:id', deleteAutomation);

export default router;
