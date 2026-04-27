import express from 'express';
import { getUserProfile, updateUserProfile, saveNutritionGoal, deleteUserAccount, exportUserData, getTimeline } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../middleware/validators.js';

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(validate(updateProfileSchema), updateUserProfile)
  .delete(deleteUserAccount);

router.get('/export', exportUserData);
router.get('/timeline', getTimeline);
router.put('/nutrition-goal', saveNutritionGoal);

export default router;
