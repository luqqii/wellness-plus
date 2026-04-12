import AIInsight from '../models/AIInsight.js';
import { generateCoachingInsight } from '../services/ai.service.js';
import DailyMetric from '../models/DailyMetric.js';

/**
 * @desc    Get all insights for the current user (paginated, filtered)
 * @route   GET /api/v1/insights
 * @access  Private
 */
export const getInsights = async (req, res, next) => {
  try {
    const { type, category, limit = 20, page = 1, dismissed } = req.query;

    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (dismissed !== undefined) filter.dismissed = dismissed === 'true';
    else filter.dismissed = false; // default: only non-dismissed

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [insights, total] = await Promise.all([
      AIInsight.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      AIInsight.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: insights.length,
      total,
      page: parseInt(page),
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate and store a fresh AI insight
 * @route   POST /api/v1/insights/generate
 * @access  Private
 */
export const generateAndStoreInsight = async (req, res, next) => {
  try {
    const { category } = req.body;

    // Get user's today metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let metrics = await DailyMetric.findOne({
      userId: req.user._id,
      date: today,
    });

    if (!metrics) {
      metrics = { stressLevel: 5, sleep: { hours: 7 }, steps: 0 };
    }

    // Generate insight via AI service
    const content = await generateCoachingInsight(req.user, metrics, { category });

    // Determine type and priority based on metrics
    let type = 'suggestion';
    let priority = 'medium';

    if (metrics.stressLevel > 7) {
      type = 'alert';
      priority = 'high';
    } else if (metrics.sleep?.hours < 6) {
      type = 'prediction';
      priority = 'high';
    }

    const insight = await AIInsight.create({
      userId: req.user._id,
      type,
      category: category || 'general',
      content,
      priority,
      metadata: {
        triggerMetric: metrics.stressLevel > 7 ? 'stress' : metrics.sleep?.hours < 6 ? 'sleep' : 'general',
        confidence: 0.85,
        relatedGoal: req.user.goals?.[0] || 'general',
      },
    });

    res.status(201).json({
      success: true,
      data: insight,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dismiss an insight
 * @route   PUT /api/v1/insights/:id/dismiss
 * @access  Private
 */
export const dismissInsight = async (req, res, next) => {
  try {
    const insight = await AIInsight.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { dismissed: true },
      { new: true }
    );

    if (!insight) {
      return res.status(404).json({ success: false, message: 'Insight not found' });
    }

    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly forecast summary
 * @route   GET /api/v1/insights/weekly-forecast
 * @access  Private
 */
export const getWeeklyForecast = async (req, res, next) => {
  try {
    // Get past 7 days of metrics for trend analysis
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const metrics = await DailyMetric.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Calculate averages
    const avgStress = metrics.length
      ? metrics.reduce((sum, m) => sum + (m.stressLevel || 5), 0) / metrics.length
      : 5;
    const avgSleep = metrics.length
      ? metrics.reduce((sum, m) => sum + (m.sleep?.hours || 7), 0) / metrics.length
      : 7;
    const avgSteps = metrics.length
      ? metrics.reduce((sum, m) => sum + (m.steps || 0), 0) / metrics.length
      : 0;
    const avgWellness = metrics.length
      ? metrics.reduce((sum, m) => sum + (m.wellnessScore || 50), 0) / metrics.length
      : 50;

    // Build forecast
    const forecast = {
      period: '7-day',
      trends: {
        stress: { average: Math.round(avgStress * 10) / 10, trend: avgStress > 6 ? 'rising' : avgStress < 4 ? 'declining' : 'stable' },
        sleep: { average: Math.round(avgSleep * 10) / 10, trend: avgSleep < 6 ? 'declining' : avgSleep > 7.5 ? 'improving' : 'stable' },
        steps: { average: Math.round(avgSteps), trend: avgSteps > 8000 ? 'great' : avgSteps > 5000 ? 'stable' : 'needs_improvement' },
        wellness: { average: Math.round(avgWellness), trend: avgWellness > 70 ? 'strong' : avgWellness > 50 ? 'moderate' : 'attention_needed' },
      },
      predictions: {
        burnoutRisk: avgStress > 7 && avgSleep < 6 ? 'high' : avgStress > 5 ? 'moderate' : 'low',
        recoveryNeeded: avgSleep < 6 || avgStress > 7,
        suggestedFocusArea: avgStress > 6 ? 'stress_management' : avgSleep < 6 ? 'sleep_improvement' : avgSteps < 5000 ? 'activity' : 'maintain',
      },
      dataPoints: metrics.length,
    };

    // Store as weekly forecast insight
    await AIInsight.create({
      userId: req.user._id,
      type: 'weekly_forecast',
      category: 'general',
      content: JSON.stringify(forecast),
      priority: forecast.predictions.burnoutRisk === 'high' ? 'urgent' : 'medium',
      metadata: {
        triggerMetric: 'weekly_aggregate',
        confidence: metrics.length >= 5 ? 0.9 : 0.6,
      },
    });

    res.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
};
