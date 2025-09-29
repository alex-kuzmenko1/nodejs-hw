import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/notes', notesRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB(); // ✅ Підключення до бази

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
