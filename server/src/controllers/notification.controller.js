import Notification from '../models/Notification.js';
import { emitNotification } from '../config/socket.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort('-createdAt').limit(20);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
export const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Trigger a contextual notification (Internal use generally, but exposed for demo)
 * @route   POST /api/v1/notifications/trigger
 * @access  Private
 */
export const triggerNotification = async (req, res, next) => {
  try {
    const { title, message, type, actionUrl } = req.body;
    
    const notification = await Notification.create({
      userId: req.user._id,
      title,
      message,
      type: type || 'insight',
      actionUrl
    });

    // Fire over socket
    emitNotification(req.user._id.toString(), 'new_notification', notification);

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
