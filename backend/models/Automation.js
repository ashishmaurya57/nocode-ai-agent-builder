import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['telegram', 'email'], // ✅ Now supports both
    required: true
  },
  config: {
    botToken: { type: String },         // for Telegram
    chatId: { type: String },           // for Telegram

    to: { type: String },               // for Email
    encryptedPassword: { type: String } // for Email
  }
});

const triggerSchema = new mongoose.Schema({
  type: { type: String, enum: ['cron', 'webhook'], required: true },
  schedule: { type: String },
  timezone: { type: String, default: 'UTC' }
});

const automationSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  trigger: triggerSchema,
  actions: [actionSchema]
}, { timestamps: true });

export default mongoose.model('Automation', automationSchema);
