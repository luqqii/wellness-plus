import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { syncProviderMetrics, syncGoogleFitMetrics } from '../services/wearable.service.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Simulate Google Fit OAuth handshake
 * @route   POST /api/v1/integrations/google-fit/auth
 * @access  Private
 */
router.post('/google-fit/auth', protect, async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Google Fit connected successfully',
      status: 'CONNECTED'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Sync all connected integrations
 * IMPORTANT: This route MUST be defined BEFORE /:provider/toggle and /:provider/sync
 * to prevent Express matching "sync-all" as a provider param.
 * @route   POST /api/v1/integrations/sync-all
 * @access  Private
 */
router.post('/sync-all', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.integrations || user.integrations.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No integrations connected. Please connect at least one source first.' 
      });
    }

    // Sync all connected providers in parallel
    const syncResults = await Promise.allSettled(
      user.integrations.map(i => syncProviderMetrics(req.user._id, i.provider))
    );

    // Update lastSync for each successfully synced integration
    user.integrations.forEach((integration, idx) => {
      if (syncResults[idx].status === 'fulfilled') {
        integration.lastSync = new Date();
      }
    });

    await user.save();

    const successCount = syncResults.filter(r => r.status === 'fulfilled').length;

    res.json({
      success: true,
      message: `Synced ${successCount} of ${user.integrations.length} source(s) successfully`,
      integrations: user.integrations,
      syncResults: syncResults.map((r, i) => ({
        provider: user.integrations[i].provider,
        status: r.status,
        data: r.status === 'fulfilled' ? r.value : null,
      }))
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Toggle an integration on/off
 * @route   POST /api/v1/integrations/:provider/toggle
 * @access  Private
 */
router.post('/:provider/toggle', protect, async (req, res, next) => {
  try {
    const { provider } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.integrations) user.integrations = [];

    const existingIndex = user.integrations.findIndex(i => i.provider === provider);

    if (existingIndex >= 0) {
      // Disconnect
      user.integrations.splice(existingIndex, 1);
    } else {
      // Connect — immediately do an initial sync to populate metrics
      user.integrations.push({
        provider,
        connectedAt: new Date(),
        lastSync: new Date()
      });
    }

    await user.save();

    // If we just connected, perform an initial sync in the background
    if (existingIndex < 0) {
      syncProviderMetrics(req.user._id, provider).catch(err =>
        console.error(`[Integrations] Initial sync failed for ${provider}:`, err)
      );
    }

    res.json({
      success: true,
      integrations: user.integrations,
      action: existingIndex >= 0 ? 'disconnected' : 'connected',
      provider,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Sync a specific connected integration
 * @route   POST /api/v1/integrations/:provider/sync
 * @access  Private
 */
router.post('/:provider/sync', protect, async (req, res, next) => {
  try {
    const { provider } = req.params;
    const user = await User.findById(req.user._id);

    const integration = user.integrations?.find(i => i.provider === provider);
    if (!integration) {
      return res.status(400).json({ 
        success: false, 
        message: `${provider} is not connected. Toggle it on first.` 
      });
    }

    // Perform sync
    const syncedData = await syncProviderMetrics(req.user._id, provider);

    // Update lastSync timestamp
    integration.lastSync = new Date();
    await user.save();

    res.json({
      success: true,
      message: `${provider} synced successfully`,
      data: syncedData,
      integrations: user.integrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Trigger explicit sync from Google Fit (legacy)
 * @route   POST /api/v1/integrations/google-fit/sync
 * @access  Private
 */
router.post('/google-fit/sync', protect, async (req, res, next) => {
  try {
    const updatedMetrics = await syncGoogleFitMetrics(req.user._id);
    res.json({
      success: true,
      message: 'Sync completed',
      metrics: updatedMetrics
    });
  } catch (error) {
    next(error);
  }
});

export default router;
