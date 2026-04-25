import express from 'express';
import {
  getInsights,
  generateAndStoreInsight,
  dismissInsight,
  getWeeklyForecast,
  predictBurnout,
  getContextAwareSuggestion,
  getOnboardingAssessment,
  analyzeQuizResult
} from '../controllers/insights.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { generateInsightSchema } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, getInsights);
router.post('/generate', protect, validate(generateInsightSchema), generateAndStoreInsight);
router.put('/:id/dismiss', protect, dismissInsight);
router.get('/weekly-forecast', protect, getWeeklyForecast);
router.post('/predict-burnout', protect, predictBurnout);
router.post('/context-aware', protect, getContextAwareSuggestion);
router.post('/onboarding-assessment', protect, getOnboardingAssessment);
router.post('/analyze-quiz', protect, analyzeQuizResult);

export default router;
