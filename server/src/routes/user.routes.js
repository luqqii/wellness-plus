import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserAccount, exportUserData } from '../controllers/user.controller.js';
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

export default router;
