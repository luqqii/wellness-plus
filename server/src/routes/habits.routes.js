import express from 'express';
import { getHabits, createHabit, updateHabit, toggleHabitCompletion, deleteHabit, exportToCalendar } from '../controllers/habits.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createHabitSchema, toggleHabitSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/calendar/export', exportToCalendar);

router.route('/')
  .get(getHabits)
  .post(validate(createHabitSchema), createHabit);

router.route('/:id')
  .put(validate(createHabitSchema), updateHabit)
  .delete(deleteHabit);

router.post('/:id/toggle', validate(toggleHabitSchema), toggleHabitCompletion);

export default router;
