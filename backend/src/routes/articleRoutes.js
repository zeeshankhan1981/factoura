import express from 'express';
import prisma from '../prismaClient.js'; 
import bcrypt from 'bcrypt'; 
import { verifyToken } from '../middleware/authMiddleware.js'; 
import blockchainService from '../services/blockchainService.js';
import databaseService from '../services/databaseService.js';
import contentAnalysisService from '../services/contentAnalysisService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware for error handling
const handleError = (res, error) => {
    logger.error('Article route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
};

// Get all articles
router.get('/', async (req, res) => {
    try {
        const articles = await databaseService.prisma.article.findMany({
            include: {
                User: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                tags: true
            }
        });
        res.json(articles);
    } catch (error) {
        logger.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Create a new article
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, content, signature, walletAddress } = req.body;
        const authorId = req.user.id;

        // Verify wallet signature
        const message = `Submitting article: "${title}" to factoura.\n\nTimestamp: ${new Date().toISOString()}`;
        const isSignatureValid = await blockchainService.verifySignature(message, signature, walletAddress);
        
        if (!isSignatureValid) {
            return res.status(401).json({ error: 'Invalid wallet signature' });
        }

        // Create article first
        const article = await databaseService.prisma.article.create({
            data: {
                title,
                content,
                authorId,
                walletAddress,
                signature,
                analysisStatus: 'pending'
            },
            include: {
                User: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        // Try to analyze content asynchronously
        try {
            const [sentimentResult, tagsResult] = await Promise.allSettled([
                contentAnalysisService.analyzeSentiment(content),
                contentAnalysisService.generateTags(content)
            ]);

            // Update article with analysis results if available
            const updateData = {
                analysisStatus: 'completed',
                analysisUpdatedAt: new Date()
            };

            if (sentimentResult.status === 'fulfilled') {
                updateData.sentimentScore = sentimentResult.value.score;
                updateData.emotionalTone = sentimentResult.value.tone;
            }

            if (tagsResult.status === 'fulfilled') {
                await databaseService.getOrCreateTags(tagsResult.value.tags);
                updateData.tags = {
                    connect: tagsResult.value.tags.map(tag => ({ name: tag }))
                };
            }

            await databaseService.prisma.article.update({
                where: { id: article.id },
                data: updateData
            });
        } catch (analysisError) {
            logger.error('Content analysis failed:', analysisError);
            // Don't fail the article creation if analysis fails
        }

        res.status(201).json(article);
    } catch (error) {
        logger.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Get article by ID
router.get('/:id', async (req, res) => {
    try {
        const article = await databaseService.prisma.article.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                User: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                tags: true
            }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        logger.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// Verify existing article
router.post('/:id/verify', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(id) }
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Update status to pending
    await prisma.article.update({
      where: { id: Number(id) },
      data: { verificationStatus: 'pending' }
    });

    // Start blockchain verification process asynchronously
    setTimeout(async () => {
      try {
        const verification = await blockchainService.verifyArticle(article.id, article.content);
        
        // Update article with verification details
        await prisma.article.update({
          where: { id: article.id },
          data: {
            verificationStatus: 'verified',
            transactionHash: verification.transactionHash,
            blockNumber: verification.blockNumber,
            contentHash: verification.contentHash,
            verifiedAt: new Date()
          }
        });
        console.log(`Article ${article.id} verified on blockchain`);
      } catch (error) {
        // Update article with failed verification status
        await prisma.article.update({
          where: { id: article.id },
          data: {
            verificationStatus: 'failed'
          }
        });
        console.error(`Article ${article.id} verification failed:`, error);
      }
    }, 5000); // Delay verification by 5 seconds to simulate blockchain processing time
    
    res.json({ message: 'Verification process started', articleId: article.id });
  } catch (error) {
    handleError(res, error);
  }
});

// Update article
router.put('/:id', async (req, res) => {
    try {
        const article = await prisma.article.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...req.body,
                tags: req.body.tags ? {
                    set: req.body.tags.map(tag => ({ name: tag }))
                } : undefined
            },
            include: {
                tags: true
            }
        });
        
        // Re-analyze content if it was updated
        if (req.body.content) {
            contentAnalysisService.analyzeSentiment(article.content, article.id)
                .catch(error => logger.error('Background sentiment analysis failed:', error));
            
            contentAnalysisService.generateTags(article.content, article.id)
                .catch(error => logger.error('Background tag generation failed:', error));
        }
        
        res.json(article);
    } catch (error) {
        handleError(res, error);
    }
});

// Delete article
router.delete('/:id', async (req, res) => {
    try {
        await prisma.article.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

export default router;