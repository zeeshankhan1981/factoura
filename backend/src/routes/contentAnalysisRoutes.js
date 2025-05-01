import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';
import contentAnalysisService from '../services/contentAnalysisService.js';

const router = express.Router();

// Middleware for error handling
const handleError = (res, error) => {
    logger.error('Content analysis route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
};

// Analyze sentiment
router.post('/sentiment', async (req, res) => {
    try {
        const { content } = req.body;
        const result = await contentAnalysisService.analyzeSentiment(content);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Generate tags
router.post('/tags', async (req, res) => {
    try {
        const { content } = req.body;
        const result = await contentAnalysisService.generateTags(content);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Health check
router.get('/health', async (req, res) => {
    try {
        const result = await contentAnalysisService.checkHealth();
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

export default router; 