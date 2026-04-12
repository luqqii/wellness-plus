import DailyMetric from '../models/DailyMetric.js';

/**
 * Mocks the Google Fit / Apple Health sync process.
 * In a production setting, this uses an external OAuth token to fetch daily
 * aggregations and stores them.
 */
export const syncGoogleFitMetrics = async (userId) => {
  try {
    console.log(`[WearableService] Fetching Google Fit data for user ${userId}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data fetched from an external wearable network
    const externalData = {
      steps: Math.floor(Math.random() * 15000), // Random daily steps
      sleepHours: 5 + Math.random() * 4,        // 5 to 9 hours of sleep
      activeMinutes: Math.floor(Math.random() * 120),
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert into our system DailyMetrics
    const metric = await DailyMetric.findOneAndUpdate(
      { userId, date: today },
      {
        $max: { steps: externalData.steps }, // Never lower steps from wearable sync
        $set: { 
          'sleep.hours': externalData.sleepHours,
          activity: externalData.activeMinutes
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return metric;
  } catch (error) {
    console.error('Error syncing Google Fit data:', error);
    throw error;
  }
};
