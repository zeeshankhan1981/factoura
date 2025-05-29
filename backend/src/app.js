import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import logger from './utils/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS to allow the frontend to access the backend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.vercel.app'] 
    : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Load optional routes
const loadOptionalRoutes = async () => {
    try {
        const [aiRoutes, contentAnalysisRoutes] = await Promise.all([
            import('./routes/aiRoutes.js'),
            import('./routes/contentAnalysisRoutes.js')
        ]);
        
        app.use('/api/ai', aiRoutes.default);
        app.use('/api/analysis', contentAnalysisRoutes.default);
        logger.info('AI and content analysis routes loaded successfully');
    } catch (error) {
        logger.warn('Optional services not available:', error.message);
        // Don't crash the server if optional routes fail to load
    }
};

// Initialize optional routes
loadOptionalRoutes().catch(error => {
    logger.error('Failed to initialize optional routes:', error);
});

app.get('/', (req, res) => {
  res.send('Welcome to the factoura. API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}

export default app;
