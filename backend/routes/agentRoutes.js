import express from 'express';
import {
  createAgent,
  getUserAgents,
  getAgentDetails,
  deleteAgent,
  updateAgent
} from '../controllers/agentController.js';

import { upload } from '../utils/fileUpload.js';
import { verifyToken } from '../config/firebase.js';

const router = express.Router();

// 🔐 Protect all routes with Firebase authentication
router.use(verifyToken);

// 📌 Create a new agent (with optional document upload)
router.post('/', upload.single('document'), createAgent);

// 📌 Get all agents of authenticated user
router.get('/', getUserAgents);

// 📌 Get specific agent details
router.get('/:id', getAgentDetails);

// 📌 Update an agent (also supports new file upload for re-embedding)
router.put('/:id', upload.single('document'), updateAgent);

// 📌 Delete an agent
router.delete('/:id', deleteAgent);

export default router;
