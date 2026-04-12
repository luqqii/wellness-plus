import DailyMetric from '../models/DailyMetric.js';

/**
 * @desc    Get activity prediction & forecast (recovery, fatigue, suggested rest)
 * @route   GET /api/v1/activity/prediction
 * @access  Private
 */
export const getActivityPrediction = async (req, res, next) => {
  try {
    // Gather past 14 days of metrics for prediction
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    startDate.setHours(0, 0, 0, 0);

    const metrics = await DailyMetric.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    if (metrics.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'Not enough data for predictions yet. Log at least 3 days of activity.',
          dataPoints: 0,
        },
      });
    }

    // Calculate rolling averages
    const last7 = metrics.slice(-7);
    const avgSteps = last7.reduce((s, m) => s + (m.steps || 0), 0) / last7.length;
    const avgSleep = last7.reduce((s, m) => s + (m.sleep?.hours || 0), 0) / last7.length;
    const avgStress = last7.reduce((s, m) => s + (m.stressLevel || 5), 0) / last7.length;
    const avgWellness = last7.reduce((s, m) => s + (m.wellnessScore || 50), 0) / last7.length;

    // Trend detection (compare last 3 days vs previous 4)
    const recent3 = last7.slice(-3);
    const older4 = last7.slice(0, 4);
    const recentSteps = recent3.reduce((s, m) => s + (m.steps || 0), 0) / recent3.length;
    const olderSteps = older4.length ? older4.reduce((s, m) => s + (m.steps || 0), 0) / older4.length : recentSteps;

    const stepsTrend = recentSteps > olderSteps * 1.15 ? 'increasing' :
                       recentSteps < olderSteps * 0.85 ? 'decreasing' : 'stable';

    // Fatigue / Burnout risk calculation
    let fatigueScore = 0;
    if (avgSleep < 6) fatigueScore += 3;
    else if (avgSleep < 7) fatigueScore += 1;
    if (avgStress > 7) fatigueScore += 3;
    else if (avgStress > 5) fatigueScore += 1;
    if (stepsTrend === 'decreasing') fatigueScore += 1;
    if (avgWellness < 40) fatigueScore += 2;

    const fatigueRisk = fatigueScore >= 6 ? 'high' :
                        fatigueScore >= 3 ? 'moderate' : 'low';

    // Recovery prediction
    const recoveryHoursNeeded = fatigueScore >= 6 ? 48 : fatigueScore >= 3 ? 24 : 0;

    // Suggested rest windows
    const suggestedRestWindows = [];
    if (fatigueRisk !== 'low') {
      const userSleepTime = req.user.onboarding?.schedule?.sleepTime || '22:00';
      suggestedRestWindows.push({
        type: 'power_nap',
        timeSlot: '14:00 - 14:30',
        reason: 'Afternoon energy dip predicted',
      });
      if (avgStress > 6) {
        suggestedRestWindows.push({
          type: 'mindfulness',
          timeSlot: '18:00 - 18:15',
          reason: 'Elevated stress — wind-down recommended',
        });
      }
      suggestedRestWindows.push({
        type: 'early_sleep',
        timeSlot: `${userSleepTime} (or 30 min earlier)`,
        reason: 'Sleep debt detected — earlier bedtime recommended',
      });
    }

    // Workout intensity recommendation
    let recommendedIntensity = 'moderate';
    if (fatigueRisk === 'high') recommendedIntensity = 'light_or_rest';
    else if (fatigueRisk === 'moderate') recommendedIntensity = 'light';
    else if (avgWellness > 70 && avgSleep > 7) recommendedIntensity = 'high';

    // Step goal for tomorrow
    const userStepGoal = req.user.onboarding?.baseline?.stepGoal || 8000;
    let tomorrowStepGoal = userStepGoal;
    if (fatigueRisk === 'high') tomorrowStepGoal = Math.round(userStepGoal * 0.6);
    else if (fatigueRisk === 'moderate') tomorrowStepGoal = Math.round(userStepGoal * 0.8);

    res.json({
      success: true,
      data: {
        weeklyAverages: {
          steps: Math.round(avgSteps),
          sleepHours: Math.round(avgSleep * 10) / 10,
          stressLevel: Math.round(avgStress * 10) / 10,
          wellnessScore: Math.round(avgWellness),
        },
        trends: {
          steps: stepsTrend,
          fatigue: fatigueRisk,
        },
        predictions: {
          fatigueRisk,
          fatigueScore: `${fatigueScore}/10`,
          burnoutWarning: fatigueScore >= 6,
          recoveryHoursNeeded,
          recommendedIntensity,
          tomorrowStepGoal,
        },
        suggestedRestWindows,
        dataPoints: metrics.length,
        confidence: metrics.length >= 10 ? 'high' : metrics.length >= 5 ? 'medium' : 'low',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current recovery status
 * @route   GET /api/v1/activity/recovery
 * @access  Private
 */
export const getRecoveryStatus = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMetrics = await DailyMetric.findOne({
      userId: req.user._id,
      date: today,
    });

    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayMetrics = await DailyMetric.findOne({
      userId: req.user._id,
      date: yesterday,
    });

    const sleepHours = todayMetrics?.sleep?.hours || yesterdayMetrics?.sleep?.hours || 0;
    const sleepQuality = todayMetrics?.sleep?.quality || yesterdayMetrics?.sleep?.quality || 5;
    const stress = todayMetrics?.stressLevel || 5;

    // Recovery score (0-100)
    let recoveryScore = 50;
    recoveryScore += (sleepHours - 7) * 8; // +/- 8 per hour from 7h baseline
    recoveryScore += (sleepQuality - 5) * 4; // +/- 4 per quality point from 5
    recoveryScore -= (stress - 5) * 5; // -5 per stress point above 5
    recoveryScore = Math.max(0, Math.min(100, Math.round(recoveryScore)));

    let status = 'optimal';
    if (recoveryScore < 30) status = 'poor';
    else if (recoveryScore < 50) status = 'low';
    else if (recoveryScore < 70) status = 'moderate';

    const recommendations = [];
    if (sleepHours < 6) recommendations.push('Prioritize sleep — aim for 7-8 hours tonight.');
    if (stress > 7) recommendations.push('High stress detected. Try a 5-minute breathing exercise.');
    if (recoveryScore < 50) recommendations.push('Consider a rest day or very light activity only.');
    if (recoveryScore >= 70) recommendations.push('You\'re well recovered! Great day for an intense workout.');

    res.json({
      success: true,
      data: {
        recoveryScore,
        status,
        factors: {
          sleepHours,
          sleepQuality,
          stressLevel: stress,
        },
        recommendations,
        readyForIntenseWorkout: recoveryScore >= 65,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's health memory (milestones)
 * @route   GET /api/v1/activity/memory
 * @access  Private
 */
export const getHealthMemory = async (req, res, next) => {
  try {
    const Milestone = (await import('../models/Milestone.js')).default;
    const milestones = await Milestone.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
      
    res.json({
      success: true,
      data: milestones,
    });
  } catch (error) {
    next(error);
  }
};
