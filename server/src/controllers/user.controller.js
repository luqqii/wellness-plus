import User from '../models/User.js';
import Habit from '../models/Habit.js';
import DailyMetric from '../models/DailyMetric.js';
import Conversation from '../models/Conversation.js';
import AIInsight from '../models/AIInsight.js';
import MealLog from '../models/MealLog.js';
import Notification from '../models/Notification.js';
import Milestone from '../models/Milestone.js';

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile & onboarding status
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.profilePic = req.body.profilePic || user.profilePic;
      user.goals = req.body.goals || user.goals;

      // Update nested objects safely
      if (req.body.preferences) {
        if (!user.preferences) user.preferences = {};
        Object.keys(req.body.preferences).forEach(key => {
          user.preferences[key] = req.body.preferences[key];
        });
        user.markModified('preferences');
      }
      
      if (req.body.onboarding) {
        if (!user.onboarding) user.onboarding = {};
        Object.keys(req.body.onboarding).forEach(key => {
          user.onboarding[key] = req.body.onboarding[key];
        });
        user.markModified('onboarding');
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const userData = updatedUser.toObject();
      delete userData.password;

      res.json({
        success: true,
        data: userData,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export all user data as JSON
 * @route   GET /api/v1/users/export
 * @access  Private
 */
export const exportUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate all data in parallel for speed
    const [
      user,
      habits,
      metrics,
      conversations,
      insights,
      meals,
      notifications
    ] = await Promise.all([
      User.findById(userId).select('-password'),
      Habit.find({ userId }),
      DailyMetric.find({ userId }),
      Conversation.find({ userId }),
      AIInsight.find({ userId }),
      MealLog.find({ userId }),
      Notification.find({ userId })
    ]);

    const exportData = {
      metadata: {
        exportedAt: new Date(),
        version: '1.0.0',
        app: 'Wellness+'
      },
      profile: user,
      habits,
      healthMetrics: metrics,
      aiCoachHistory: conversations,
      personalizedInsights: insights,
      nutritionLogs: meals,
      notifications
    };

    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account and all associated data
 * @route   DELETE /api/v1/users/profile
 * @access  Private
 */
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete all associated records in parallel
    await Promise.all([
      User.findByIdAndDelete(userId),
      Habit.deleteMany({ userId }),
      DailyMetric.deleteMany({ userId }),
      Conversation.deleteMany({ userId }),
      AIInsight.deleteMany({ userId }),
      MealLog.deleteMany({ userId }),
      Notification.deleteMany({ userId })
    ]);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data permanently deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Health Memory Timeline
 * @route   GET /api/v1/users/timeline
 * @access  Private
 */
export const getTimeline = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const milestones = await Milestone.find({ userId: req.user._id }).sort({ achievedAt: -1 });

    const timeline = [];

    // Add milestones
    milestones.forEach(m => {
      timeline.push({
        id: m._id,
        date: m.achievedAt || m.createdAt,
        title: m.title,
        description: m.description,
        icon: m.icon || 'Star',
        color: m.color || 'var(--c-orange)'
      });
    });

    // Add onboarding date
    if (user) {
      timeline.push({
        id: 'onboarding',
        date: user.createdAt,
        title: 'Joined Wellness+',
        description: 'Began the wellness journey.',
        icon: 'Activity',
        color: 'var(--c-blue)'
      });
    }

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      data: timeline
    });
  } catch (error) {
    next(error);
  }
};
