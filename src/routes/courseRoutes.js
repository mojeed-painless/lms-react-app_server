// lms-backend/src/routes/courseRoutes.js

import express from 'express';
import { 
    getCourses, 
    getMyCourses, 
    createCourse, 
    deleteCourse,
    getCourseDetails
} from '../controllers/courseController.js';
import { protect, instructor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCourses); // /api/courses

// Instructor route: Create new course (Requires login AND instructor role)
router.route('/management').post(protect, instructor, createCourse); 

// New route for instructor to view their own courses
router.route('/management/my').get(protect, instructor, getMyCourses);

// Instructor route: Delete a specific course (Requires login AND instructor role)
router.route('/:id')
    .get(getCourseDetails)
    .delete(protect, instructor, deleteCourse);

export default router;