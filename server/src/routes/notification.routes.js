import express from 'express';
import { getNotifications, markRead, triggerNotification } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { triggerNotificationSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markRead);
router.post('/trigger', validate(triggerNotificationSchema), triggerNotification);

export default router;
