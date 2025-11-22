// lms-backend/src/models/Course.js

import mongoose from 'mongoose';

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '/images/default-course.jpg',
    },
    instructor: {
      // Link to the User model, representing the Instructor
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;