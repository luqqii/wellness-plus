import DailyMetric from '../models/DailyMetric.js';

/**
 * Per-provider realistic data profiles.
 * Each provider focuses on different biometrics.
 */
const PROVIDER_PROFILES = {
  google: {
    steps: () => Math.floor(4000 + Math.random() * 10000),
    sleepHours: () => 5.5 + Math.random() * 3,
    activeMinutes: () => Math.floor(20 + Math.random() * 80),
    stressLevel: () => Math.floor(3 + Math.random() * 5),
  },
  apple: {
    steps: () => Math.floor(5000 + Math.random() * 9000),
    sleepHours: () => 6 + Math.random() * 3,
    activeMinutes: () => Math.floor(30 + Math.random() * 90),
    stressLevel: () => Math.floor(2 + Math.random() * 5),
  },
  garmin: {
    // Garmin users tend to be serious athletes — more steps, more activity
    steps: () => Math.floor(8000 + Math.random() * 14000),
    sleepHours: () => 7 + Math.random() * 2,
    activeMinutes: () => Math.floor(60 + Math.random() * 120),
    stressLevel: () => Math.floor(2 + Math.random() * 4),
  },
  oura: {
    // Oura focuses on sleep quality and recovery
    steps: () => Math.floor(4000 + Math.random() * 7000),
    sleepHours: () => 7 + Math.random() * 2.5,
    activeMinutes: () => Math.floor(20 + Math.random() * 60),
    stressLevel: () => Math.floor(2 + Math.random() * 3),
  },
  calendar: {
    // Calendar only informs context; use average metrics
    steps: () => Math.floor(5000 + Math.random() * 5000),
    sleepHours: () => 7,
    activeMinutes: () => 30,
    stressLevel: () => 5,
  },
  huawei: {
    // Huawei users have strong sleep and step tracking
    steps: () => Math.floor(6000 + Math.random() * 8000),
    sleepHours: () => 6.5 + Math.random() * 2,
    activeMinutes: () => Math.floor(40 + Math.random() * 60),
    stressLevel: () => Math.floor(3 + Math.random() * 4),
  },
  wechat: {
    // WeChat Sports (WeRun) is primarily steps tracking via phone
    steps: () => Math.floor(3000 + Math.random() * 12000),
    sleepHours: () => 7, // Fallback
    activeMinutes: () => Math.floor(20 + Math.random() * 40),
    stressLevel: () => 5, // Fallback
  },
};

/**
 * Sync metrics for a specific provider.
 * Uses per-provider data profiles to generate realistic data.
 */
export const syncProviderMetrics = async (userId, provider = 'google') => {
  try {
    const profile = PROVIDER_PROFILES[provider] || PROVIDER_PROFILES.google;

    console.log(`[WearableService] Syncing ${provider} data for user ${userId}...`);

    // Simulate API/BLE latency
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

    const externalData = {
      steps: profile.steps(),
      sleepHours: profile.sleepHours(),
      activeMinutes: profile.activeMinutes(),
      stressLevel: profile.stressLevel(),
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metric = await DailyMetric.findOneAndUpdate(
      { userId, date: today },
      {
        $max: { steps: externalData.steps },
        $set: {
          'sleep.hours': parseFloat(externalData.sleepHours.toFixed(1)),
          stressLevel: externalData.stressLevel,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      steps: metric.steps,
      sleep: metric.sleep,
      stressLevel: metric.stressLevel,
      provider,
      syncedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[WearableService] Error syncing ${provider}:`, error);
    throw error;
  }
};

/**
 * Legacy alias — kept for backward compatibility.
 */
export const syncGoogleFitMetrics = (userId) => syncProviderMetrics(userId, 'google');
