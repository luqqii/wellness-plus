import express from 'express';
import {
  getInsights,
  generateAndStoreInsight,
  dismissInsight,
  getWeeklyForecast,
} from '../controllers/insights.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { generateInsightSchema } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, getInsights);
router.post('/generate', protect, validate(generateInsightSchema), generateAndStoreInsight);
router.put('/:id/dismiss', protect, dismissInsight);
router.get('/weekly-forecast', protect, getWeeklyForecast);

export default router;
