// lms-backend/src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// --- 1. Middleware to protect routes (Authentication) ---
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token (Token is after "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user based on the decoded ID (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Proceed to the next middleware/route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// --- 2. Middleware for specific role check (Authorization) ---
const instructor = (req, res, next) => {
  // Check if the user is authenticated (from the protect middleware) 
  // AND has the 'instructor' role
  if (req.user && req.user.role === 'instructor') {
    next(); // Authorized, proceed
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as an instructor');
  }
};

export { protect, instructor };