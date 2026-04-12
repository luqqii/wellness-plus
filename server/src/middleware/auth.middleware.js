import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

/**
 * Middleware to protect routes via JWT
 */
export const protect = async (req, res, next) => {
  let token;

  // 1) Verify presence of token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // optional: token in cookies
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // 2) Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3) Retrieve user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};
