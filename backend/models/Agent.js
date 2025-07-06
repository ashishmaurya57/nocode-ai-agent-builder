import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  memory: { type: String },
  apiKey: { type: String }, // ✅ Needed for model that require user-provided API key
  model: { type: String },
  tools: [String],
  prompt: { type: String, required: true },
  documentPath: { type: String },     // ✅ For uploaded document path
  userId: { type: String, required: true }, // ✅ Firebase UID
  createdAt: { type: Date, default: Date.now },
    useRAG: { type: Boolean, default: false },
embedProvider: { type: String, enum: ['openai','huggingface'], default: 'openai' },
embedApiKey: { type: String },
 vectorTableName: {
    type: String // for PostgreSQL
  },
  vectorCollectionName: {
    type: String // optional: for Chroma (future use)
  },
   vectorNamespace: {
    type: String // for Redis
  },
  // memory: 'Redis' | 'PostgreSQL' | 'Chroma',
  // vectorNamespace: 'agent:<agentId>', // For Redis
  // vectorTableName: 'embeddings_agent_<agentId>', // For PostgreSQL
  // vectorCollectionName: 'chroma_<agentId>'

});

agentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// Virtual field: make `prompt` accessible like `agent.prompt`
// agentSchema.virtual('prompt').get(function () {
//   return this.prompt;
// });

agentSchema.set('toJSON', { virtuals: true });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
