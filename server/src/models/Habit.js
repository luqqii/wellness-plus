import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      maxlength: 60,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    icon: {
      type: String,
      default: '💧',
    },
    color: {
      type: String,
      default: 'var(--c-blue)',
    },
    frequency: {
      type: {
        type: String,
        enum: ['daily', 'weekly', 'some_days'],
        default: 'daily',
      },
      days: [Number], // 0-6 for specific days
      timesPerDay: {
        type: Number,
        default: 1,
      },
    },
    timeTemplate: {
      type: String,
      enum: ['any', 'morning', 'afternoon', 'evening'],
      default: 'any',
    },
    active: {
      type: Boolean,
      default: true,
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastCompleted: { type: Date },
    },
    // Array to track completion. In a scale app, this might be a separate collection
    progress: [
      {
        date: { type: Date },
        completed: { type: Boolean, default: false },
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Habit', habitSchema);
