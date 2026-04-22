import * as authService from '../services/auth.service.js';

// Helper to send cookie along with response
const sendTokenResponse = (user, statusCode, res) => {
  const token = authService.generateToken(user._id);

  // Avoid sending password in response
  const userData = user.toObject();
  delete userData.password;

  res.status(statusCode)
    // Optional cookie setting
    // .cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), httpOnly: true })
    .json({
      success: true,
      token,
      user: userData,
    });
};

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide an email and password');
      error.statusCode = 400;
      throw error;
    }

    const user = await authService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    sendTokenResponse(req.user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/v1/auth/details
 * @access  Private
 */
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      gender: req.body.gender,
      goals: req.body.goals,
      activityLevel: req.body.activityLevel,
      profilePic: req.body.profilePic,
    };

    if (req.body.onboardingCompleted) {
      fieldsToUpdate['onboarding.completed'] = true;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const user = await authService.updateUser(req.user._id, fieldsToUpdate);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

