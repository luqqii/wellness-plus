import mongoose from 'mongoose';

const dailyMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    steps: {
      type: Number,
      default: 0,
    },
    sleep: {
      hours: { type: Number, default: 0 },
      quality: { type: Number, min: 1, max: 10, default: 5 },
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'low', 'bad'],
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      water: { type: Number, default: 0 }, // in glasses
    },
    wellnessScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one metric document per user per day
dailyMetricSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyMetric', dailyMetricSchema);
