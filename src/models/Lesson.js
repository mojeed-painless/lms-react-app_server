// lms-backend/src/models/Lesson.js

import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
  {
    course: {
      // Link to the Course this lesson belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'document', 'quiz'],
      required: true,
    },
    contentUrl: {
      // URL for video or document file
      type: String,
    },
    orderIndex: {
      // Determines the sequence of lessons within a course
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;