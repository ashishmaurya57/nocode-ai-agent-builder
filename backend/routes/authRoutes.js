import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { verifyToken } from '../config/firebase.js';

const router = express.Router();

router.post('/register', verifyToken, registerUser);

export default router;