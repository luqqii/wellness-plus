import DailyMetric from '../models/DailyMetric.js';

/**
 * @desc    Get metrics for a specific date or today
 * @route   GET /api/v1/metrics
 * @access  Private
 */
export const getMetrics = async (req, res, next) => {
  try {
    // If no date provided, default to today
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    // Normalize to midnight UTC for consistent querying
    dateParam.setHours(0, 0, 0, 0);

    const metrics = await DailyMetric.findOne({
      userId: req.user._id,
      date: dateParam
    });

    res.json({
      success: true,
      data: metrics || null // Return null if not created yet
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get metrics trend for the past N days
 * @route   GET /api/v1/metrics/trend
 * @access  Private
 */
export const getMetricsTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const metrics = await DailyMetric.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or Update today's metrics
 * @route   POST /api/v1/metrics
 * @access  Private
 */
export const saveMetrics = async (req, res, next) => {
  try {
    const dateParam = req.body.date ? new Date(req.body.date) : new Date();
    dateParam.setHours(0, 0, 0, 0);

    // Dynamic update object
    const updateFields = { ...req.body };
    delete updateFields.date; 
    delete updateFields.userId; 

    // Find and update or insert new
    const metrics = await DailyMetric.findOneAndUpdate(
      { userId: req.user._id, date: dateParam },
      { $set: updateFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Check for activity milestones
    const { checkActivityMilestones } = await import('../services/milestone.service.js');
    await checkActivityMilestones(req.user, metrics);

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};
