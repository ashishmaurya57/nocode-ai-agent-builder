import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true }
});

const chatSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  userId: { type: String, required: true },
  messages: [messageSchema],
   pdfPath: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
