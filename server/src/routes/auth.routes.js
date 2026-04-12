import express from 'express';
import { signup, login, getMe, refresh, updateDetails } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);

router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);
router.post('/refresh', protect, refresh);


export default router;
