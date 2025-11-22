// lms-backend/src/controllers/courseController.js

import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// @desc    Fetch all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  // Find all courses that are published.
  // We use .populate('instructor', 'username') to pull the instructor's username 
  // from the User model instead of just getting the ID.
  const courses = await Course.find({ isPublished: true }).populate(
    'instructor', 
    'username' // Only select the 'username' field from the User model
  );

  res.json(courses);
});

// @desc    Create a new course
// @route   POST /api/courses/management
// @access  Private/Instructor
const createCourse = asyncHandler(async (req, res) => {
  // req.user is populated by the 'protect' middleware
  const { title, description, category, price, thumbnailUrl } = req.body;

  const course = new Course({
    title: title || 'New Course Title', // Default value for safety
    description: description || 'Brief description of the course.',
    instructor: req.user._id, // Set the instructor to the logged-in user
    category: category || 'General',
    price: price || 0,
    thumbnailUrl: thumbnailUrl || '/images/default-course.jpg',
    isPublished: false, // Must be explicitly published later
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse); // 201 Created
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    // SECURITY CHECK: Only allow the course creator (instructor) to delete it
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this course.');
    }
    
    // In a real LMS, you would also delete all related lessons and progress here.
    await Course.deleteOne({ _id: course._id });
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Fetch courses created by the logged-in instructor
// @route   GET /api/courses/management/my
// @access  Private/Instructor
const getMyCourses = asyncHandler(async (req, res) => {
    // req.user is populated by the 'protect' middleware
    const courses = await Course.find({ instructor: req.user._id });

    // Populate instructor to get their username (although redundant here, it's good practice)
    res.json(courses);
});

// @desc    Fetch a single course details and all its lessons
// @route   GET /api/courses/:id
// @access  Public (for viewing structure)
const getCourseDetails = asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    // 1. Find the Course and populate the instructor's username
    const course = await Course.findById(courseId).populate(
        'instructor', 
        'username'
    );

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // 2. Find all Lessons belonging to this course, sorted by orderIndex
    const lessons = await Lesson.find({ course: courseId }).sort('orderIndex');

    // 3. Return the course object combined with the list of lessons
    res.json({
        course,
        lessons,
    });
});


export { 
    getCourses, 
    getMyCourses, 
    createCourse, 
    deleteCourse,
    getCourseDetails, 
};