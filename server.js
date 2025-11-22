import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the database connection function (we'll create this next)
import connectDB from './src/config/db.js';

// --- INITIALIZE APP ---
const app = express();

// --- MIDDLEWARE ---
// Use CORS to allow frontend requests
app.use(cors()); 
// Body parser to accept JSON data
app.use(express.json());

// --- ROUTES ---
// Simple root route to test if the server is running
app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

// Use the User Routes, prefixing them with /api/users
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// --- ERROR MIDDLEWARE ---
// Must be placed AFTER routes
app.use(notFound);
app.use(errorHandler);

// --- SERVER LISTEN ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  // Connect to the database AFTER the server starts listening (or before)
  connectDB(); 
});