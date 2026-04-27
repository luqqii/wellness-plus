import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { syncProviderMetrics, syncGoogleFitMetrics } from '../services/wearable.service.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Sync all connected integrations
 * NOTE: MUST be before /:provider routes to avoid Express matching "sync-all" as a provider param.
 * @route   POST /api/v1/integrations/sync-all
 * @access  Private
 */
router.post('/sync-all', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('integrations');
    if (!user?.integrations?.length) {
      return res.status(400).json({
        success: false,
        message: 'No integrations connected. Please connect at least one source first.'
      });
    }

    // Sync all providers in parallel
    const syncResults = await Promise.allSettled(
      user.integrations.map(i => syncProviderMetrics(req.user._id, i.provider))
    );

    // Atomically update all lastSync timestamps
    const now = new Date();
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'integrations.$[].lastSync': now } }
    );

    const updatedUser = await User.findById(req.user._id).select('integrations');
    const successCount = syncResults.filter(r => r.status === 'fulfilled').length;

    res.json({
      success: true,
      message: `Synced ${successCount} of ${user.integrations.length} source(s) successfully`,
      integrations: updatedUser.integrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Toggle an integration on/off (connect or disconnect)
 * @route   POST /api/v1/integrations/:provider/toggle
 * @access  Private
 */
router.post('/:provider/toggle', protect, async (req, res, next) => {
  try {
    const { provider } = req.params;
    const user = await User.findById(req.user._id).select('integrations');

    const existingIntegration = user.integrations?.find(i => i.provider === provider);

    let updatedUser;
    if (existingIntegration) {
      // Disconnect — use $pull to avoid triggering pre-save hooks on password
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { integrations: { provider } } },
        { new: true, select: 'integrations' }
      );
    } else {
      // Connect — use $push to avoid triggering pre-save hooks on password
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { integrations: { provider, connectedAt: new Date(), lastSync: new Date() } } },
        { new: true, select: 'integrations' }
      );
      // Background initial sync after connecting
      syncProviderMetrics(req.user._id, provider).catch(err =>
        console.error(`[Integrations] Initial sync failed for ${provider}:`, err)
      );
    }

    res.json({
      success: true,
      integrations: updatedUser.integrations,
      action: existingIntegration ? 'disconnected' : 'connected',
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
    const user = await User.findById(req.user._id).select('integrations');

    const integration = user.integrations?.find(i => i.provider === provider);
    if (!integration) {
      return res.status(400).json({
        success: false,
        message: `${provider} is not connected. Toggle it on first.`
      });
    }

    // Perform sync
    const syncedData = await syncProviderMetrics(req.user._id, provider);

    // Atomically update lastSync
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, 'integrations.provider': provider },
      { $set: { 'integrations.$.lastSync': new Date() } },
      { new: true, select: 'integrations' }
    );

    res.json({
      success: true,
      message: `${provider} synced successfully`,
      data: syncedData,
      integrations: updatedUser.integrations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
