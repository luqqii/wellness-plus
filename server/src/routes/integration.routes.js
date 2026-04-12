import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as wearableService from '../services/wearable.service.js';

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

export default router;
