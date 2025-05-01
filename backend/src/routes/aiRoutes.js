import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// Middleware for error handling
const handleError = (res, error) => {
    logger.error('AI route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
};

// Generate content
router.post('/generate', async (req, res) => {
    try {
        const { prompt, model } = req.body;
        const result = await aiService.generate(prompt, model);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Analyze content
router.post('/analyze', async (req, res) => {
    try {
        const { content, model } = req.body;
        const result = await aiService.analyzeContent(content, model);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Fact check
router.post('/fact-check', async (req, res) => {
    try {
        const { claim, model } = req.body;
        const result = await aiService.factCheck(claim, model);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Summarize content
router.post('/summarize', async (req, res) => {
    try {
        const { content, model } = req.body;
        const result = await aiService.summarize(content, model);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Quick fact check
router.post('/quick-check', async (req, res) => {
    try {
        const { claim, model } = req.body;
        const result = await aiService.quickCheck(claim, model);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// AI routes will be implemented here
router.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

export default router; 