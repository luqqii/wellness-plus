import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'stressed', 'motivated'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Chat Session',
    },
    messages: [messageSchema],
    active: {
      type: Boolean,
      default: true,
    },
    metadata: {
      totalMessages: { type: Number, default: 0 },
      dominantSentiment: String,
      topicsDiscussed: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching recent conversations
conversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
