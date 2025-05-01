import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Enable CORS to allow the frontend to access the backend
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],  // Frontend URLs
  methods: 'GET,POST,PUT,DELETE',   // Allowed HTTP methods
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the factoura. API!');
});

export default app;
