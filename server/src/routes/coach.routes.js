import express from 'express';
import {
  chatWithCoach,
  getCoachingInsight,
  getConversations,
  getConversation,
  deleteConversation,
  generateRoutine,
} from '../controllers/coach.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { chatSchema } from '../middleware/validators.js';

const router = express.Router();

router.post('/chat', protect, validate(chatSchema), chatWithCoach);
router.get('/insight', protect, getCoachingInsight);
router.get('/routine', protect, generateRoutine);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversation);
router.delete('/conversations/:id', protect, deleteConversation);

export default router;
