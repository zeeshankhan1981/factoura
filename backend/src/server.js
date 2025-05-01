/*
 * Copyright (c) 2025 factoura.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(join(__dirname, '../../frontend/build')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/analysis', analysisRoutes);

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`factoura. server running on port ${PORT}`);
});

export default app;