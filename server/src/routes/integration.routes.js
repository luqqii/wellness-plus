import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as wearableService from '../services/wearable.service.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Simulate Google Fit OAuth handshake
 * @route   POST /api/v1/integrations/google-fit/auth
 * @access  Private
 */
router.post('/google-fit/auth', protect, async (req, res, next) => {
  try {
    // In production, this would kick off passport.js or redirect
    // to Google's consent screen. Here we mock success.
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
 * @desc    Trigger explicit sync from Google Fit
 * @route   POST /api/v1/integrations/google-fit/sync
 * @access  Private
 */
router.post('/google-fit/sync', protect, async (req, res, next) => {
  try {
    const updatedMetrics = await wearableService.syncGoogleFitMetrics(req.user._id);
    
    res.json({
      success: true,
      message: 'Sync completed',
      metrics: updatedMetrics
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Toggle an integration (CrossSource Data Sync)
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
      // Connect
      user.integrations.push({
        provider,
        connectedAt: new Date(),
        lastSync: new Date()
      });
    }
    
    await user.save();
    
    res.json({
      success: true,
      integrations: user.integrations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Sync all connected integrations
 * @route   POST /api/v1/integrations/sync-all
 * @access  Private
 */
router.post('/sync-all', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.integrations || user.integrations.length === 0) {
      return res.status(400).json({ success: false, message: 'No integrations connected' });
    }
    
    // Update lastSync timestamp
    user.integrations.forEach(i => {
      i.lastSync = new Date();
    });
    
    await user.save();
    
    // Simulate updating metrics like Google Fit
    await wearableService.syncGoogleFitMetrics(req.user._id);
    
    res.json({
      success: true,
      message: 'All sources synced successfully',
      integrations: user.integrations
    });
  } catch (error) {
    next(error);
  }
});

export default router;
