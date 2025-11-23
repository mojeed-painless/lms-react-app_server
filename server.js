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


// 🔑 CORS Configuration (CRUCIAL FOR PRODUCTION)
const allowedOrigins = [
  'http://localhost:5173', 
  'https://lms-react-app-client.vercel.app'
];

// Add the Vercel URL only if it's available in the environment
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allows requests from listed origins or no origin (e.g., Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false); 
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(cors({
//     origin: 'http://localhost:5000', // <--- Make sure this port matches your frontend
//     credentials: true,
// }));

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