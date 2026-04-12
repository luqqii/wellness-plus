import Habit from '../models/Habit.js';

/**
 * @desc    Get all active habits for user
 * @route   GET /api/v1/habits
 * @access  Private
 */
export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, active: true }).sort('-createdAt');
    
    res.json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new habit
 * @route   POST /api/v1/habits
 * @access  Private
 */
export const createHabit = async (req, res, next) => {
  try {
    // Add user to body
    req.body.userId = req.user._id;

    const habit = await Habit.create(req.body);

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update habit details
 * @route   PUT /api/v1/habits/:id
 * @access  Private
 */
export const updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Ensure user owns habit
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this habit' });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle habit completion for today
 * @route   POST /api/v1/habits/:id/toggle
 * @access  Private
 */
export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { date, completed } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Find progress entry for this date
    const progressIndex = habit.progress.findIndex(p => {
      const pDate = new Date(p.date);
      return pDate.getTime() === targetDate.getTime();
    });

    if (progressIndex > -1) {
      habit.progress[progressIndex].completed = completed;
    } else {
      habit.progress.push({ date: targetDate, completed });
    }

    // Recalculate basic streak details (simplified for MVP)
    if (completed) {
      habit.streak.current += 1;
      habit.streak.lastCompleted = new Date();
      if (habit.streak.current > habit.streak.longest) {
        habit.streak.longest = habit.streak.current;
      }
    } else {
      // If toggled off right after toggling on, subtract streak
      const today = new Date();
      today.setHours(0,0,0,0);
      if (targetDate.getTime() === today.getTime()) {
         habit.streak.current = Math.max(0, habit.streak.current - 1);
      }
    }

    await habit.save();

    // Check for habit milestones if completed
    if (completed) {
      const { checkHabitMilestones } = await import('../services/milestone.service.js');
      await checkHabitMilestones(req.user, habit);
    }

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete habit
 * @route   DELETE /api/v1/habits/:id
 * @access  Private
 */
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Soft delete
    habit.active = false;
    await habit.save();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export habits to Calendar format (.ics) stub
 * @route   GET /api/v1/habits/calendar/export
 * @access  Private
 */
export const exportToCalendar = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, active: true });

    let icsString = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wellness+//NONSGML v1.0//EN\n`;
    
    habits.forEach(h => {
      icsString += `BEGIN:VEVENT\nUID:${h._id}@wellness.app\nSUMMARY:${h.title}\nEND:VEVENT\n`;
    });
    
    icsString += `END:VCALENDAR`;

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="wellness-habits.ics"');
    res.send(icsString);
  } catch (error) {
    next(error);
  }
};
