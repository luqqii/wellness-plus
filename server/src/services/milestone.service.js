import Milestone from '../models/Milestone.js';

/**
 * Check metrics to see if any new milestones are unlocked
 */
export const checkActivityMilestones = async (user, metrics) => {
  try {
    const newMilestones = [];

    // Steps Milestone
    if (metrics.steps >= 10000) {
      const exists = await Milestone.findOne({ userId: user._id, title: 'Hit 10K Steps' });
      if (!exists) {
        const ms = await Milestone.create({
          userId: user._id,
          title: 'Hit 10K Steps',
          context: 'Amazing! You reached your goal.',
          icon: '🏃',
          color: 'var(--c-teal)',
          type: 'activity',
        });
        newMilestones.push(ms);
      }
    }

    // You can add more checks like 15K steps, long sleep streak, etc.

    return newMilestones;
  } catch (err) {
    console.error('Error generating activity milestones:', err.message);
  }
};

/**
 * Check habit updates to see if any streak milestones are unlocked
 */
export const checkHabitMilestones = async (user, habit) => {
  try {
    const newMilestones = [];

    const streak = habit.streak?.current || 0;
    const titleLower = habit.title.toLowerCase();

    // Generic 7-Day Streak
    if (streak >= 7) {
      const title = `7-Day Streak: ${habit.title}`;
      const exists = await Milestone.findOne({ userId: user._id, title });
      if (!exists) {
        const ms = await Milestone.create({
          userId: user._id,
          title,
          context: 'Consistency is key. Keep going!',
          icon: '🔥',
          color: 'var(--c-orange)',
          type: 'habit',
        });
        newMilestones.push(ms);
      }
    }

    // Specific Meditation Milestone
    if (streak >= 30 && titleLower.includes('medit')) {
      const title = 'Zen Master';
      const exists = await Milestone.findOne({ userId: user._id, title });
      if (!exists) {
        const ms = await Milestone.create({
          userId: user._id,
          title,
          context: '30 days of meditation completed.',
          icon: '🧘',
          color: 'var(--c-purple)',
          type: 'habit',
        });
        newMilestones.push(ms);
      }
    }

    // Specific Water Milestone
    if (streak >= 14 && titleLower.includes('water')) {
      const title = 'Hydro Hero';
      const exists = await Milestone.findOne({ userId: user._id, title });
      if (!exists) {
        const ms = await Milestone.create({
          userId: user._id,
          title,
          context: 'Hit water goal for 14 days straight.',
          icon: '💧',
          color: 'var(--c-blue)',
          type: 'habit',
        });
        newMilestones.push(ms);
      }
    }

    return newMilestones;
  } catch (err) {
    console.error('Error generating habit milestones:', err.message);
  }
};
