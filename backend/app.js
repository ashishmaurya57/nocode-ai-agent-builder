import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import { initializeFirebase } from './config/firebase.js';
import { apiLogger } from './middleware/logger.js';

import automationRoutes from './routes/automationRoutes.js';
import webhookRoute from './routes/webHookRoutes.js';
import telegramTestRoutes from './routes/testRoutes.js';
import { scheduleAllAutomations } from './services/automationRunner.js';


dotenv.config();

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add after other middleware
app.use(apiLogger);

// === Firebase Init ===
try {
  initializeFirebase();
  console.log("✅ Firebase initialized");
} catch (err) {
  console.error("❌ Firebase init failed:", err.message);
}

// === MongoDB Connection ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // ✅ Start automation scheduler after DB is connected
    scheduleAllAutomations();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));


// === API Routes ===
app.use('/api/test', telegramTestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/automations', automationRoutes);  // ✅ New
app.use('/api/webhook', webhookRoute);  
app.use('/api', modelRoutes);  // NOTE: this should be after '/api/auth' etc. to avoid clashes

// === Basic Health Check ===
app.get('/', (req, res) => {
  res.send('🚀 No-Code Agent Builder API is running');
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
