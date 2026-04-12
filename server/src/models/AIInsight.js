import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['prediction', 'suggestion', 'nudge', 'weekly_forecast', 'alert'],
      required: true,
    },
    category: {
      type: String,
      enum: ['nutrition', 'activity', 'sleep', 'stress', 'habit', 'general'],
      default: 'general',
    },
    content: {
      type: String,
      required: [true, 'Insight content is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    actionable: {
      type: Boolean,
      default: true,
    },
    dismissed: {
      type: Boolean,
      default: false,
    },
    metadata: {
      triggerMetric: String,    // what metric triggered this insight
      confidence: Number,       // AI confidence score 0-1
      relatedGoal: String,      // which user goal this relates to
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching recent insights efficiently
aiInsightSchema.index({ userId: 1, createdAt: -1 });
aiInsightSchema.index({ userId: 1, type: 1 });

export default mongoose.model('AIInsight', aiInsightSchema);
