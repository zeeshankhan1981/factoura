import express from 'express';
import contentAnalysisService from '../services/contentAnalysisService.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Health check for analysis service
router.get('/health', async (req, res) => {
  try {
    const result = await contentAnalysisService.checkHealth();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking analysis service health:', error);
    res.status(503).json({ 
      status: 'unavailable',
      message: 'Content analysis service is unavailable'
    });
  }
});

// Analyze sentiment of text
router.post('/sentiment', verifyToken, async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const result = await contentAnalysisService.analyzeSentiment(text, title);
    
    if (!result) {
      return res.status(503).json({ message: 'Sentiment analysis service is unavailable' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in sentiment analysis endpoint:', error);
    res.status(500).json({ message: 'Error analyzing sentiment' });
  }
});

// Generate tags for text
router.post('/tags', verifyToken, async (req, res) => {
  try {
    const { text, title, existingTags, maxTags } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const result = await contentAnalysisService.generateTags(
      text, 
      title, 
      existingTags || [], 
      maxTags || 10
    );
    
    if (!result) {
      return res.status(503).json({ message: 'Tag generation service is unavailable' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in tag generation endpoint:', error);
    res.status(500).json({ message: 'Error generating tags' });
  }
});

export default router;
