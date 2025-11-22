// lms-backend/src/routes/userRoutes.js

import express from 'express';
import { registerUser, authUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/register').post(registerUser);

export default router;