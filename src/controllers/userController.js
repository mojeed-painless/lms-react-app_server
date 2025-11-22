// lms-backend/src/controllers/userController.js

import asyncHandler from 'express-async-handler'; // Utility for handling exceptions in async functions
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists with that email');
  }

  // 2. Create the user
  const user = await User.create({
    username,
    email,
    password, // Mongoose pre-save middleware will hash this
    role: role || 'stuent'
  });

  // 3. Respond with user data and the token
  if (user) {
    res.status(201).json({ // 201 Created
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Send JWT to client
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body; 
  // We use 'identifier' because the user can log in with EITHER username or email

  // 1. Find the user by EITHER username OR email
  const user = await User.findOne({ 
    $or: [{ email: identifier }, { username: identifier }] 
  });

  // 2. Check if the user exists AND if the password matches
  if (user && (await user.matchPassword(password))) {
    // 3. Success: Respond with user data and the token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate new JWT
    });
  } else {
    // 4. Failure
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid credentials (Username/Email or Password)');
  }
});

export { registerUser, authUser };