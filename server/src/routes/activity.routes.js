import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getActivityPrediction, getRecoveryStatus, getHealthMemory } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(protect);

router.get('/prediction', getActivityPrediction);
router.get('/recovery', getRecoveryStatus);
router.get('/memory', getHealthMemory);

export default router;
