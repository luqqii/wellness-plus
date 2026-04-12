import express from 'express';
import { getMetrics, getMetricsTrend, saveMetrics } from '../controllers/metrics.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { saveMetricsSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMetrics)
  .post(validate(saveMetricsSchema), saveMetrics);

router.get('/trend', getMetricsTrend);

export default router;
