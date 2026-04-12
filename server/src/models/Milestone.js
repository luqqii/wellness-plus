import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '🏆',
  },
  color: {
    type: String,
    default: 'var(--c-teal)',
  },
  type: {
    type: String,
    enum: ['activity', 'habit', 'nutrition'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// Ensure a user doesn't get duplicate milestones for the exact same achievement
milestoneSchema.index({ userId: 1, title: 1 }, { unique: true });

export default mongoose.model('Milestone', milestoneSchema);
