import express from 'express';
import multer from 'multer';
import { runAgentChat, getChatHistory, embedPdfHandler } from '../controllers/chatController.js';
import { verifyToken } from '../config/firebase.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(verifyToken);

router.post('/:id/embed', upload.single('file'), embedPdfHandler); // 🔹 For embedding PDF
router.post('/:id/run', runAgentChat);                              // 🔹 For chat messages
router.get('/:id/history', getChatHistory);

export default router;
