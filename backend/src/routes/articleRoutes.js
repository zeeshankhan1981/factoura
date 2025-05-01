import express from 'express';
import prisma from '../prismaClient.js'; 
import bcrypt from 'bcrypt'; 
import { verifyToken } from '../middleware/authMiddleware.js'; 
import blockchainService from '../services/blockchainService.js';

const router = express.Router();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        User: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });
    
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
});

// Create a new article
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.userId;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    // Create article in database
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId,
        verificationStatus: 'pending'
      },
    });

    // Start blockchain verification process
    blockchainService.verifyArticle(newArticle.id, content)
      .then(async (verification) => {
        // Update article with verification details
        await prisma.article.update({
          where: { id: newArticle.id },
          data: {
            verificationStatus: 'verified',
            transactionHash: verification.transactionHash,
            blockNumber: verification.blockNumber,
            contentHash: verification.contentHash,
            verifiedAt: new Date()
          }
        });
        console.log(`Article ${newArticle.id} verified on blockchain`);
      })
      .catch(async (error) => {
        // Update article with failed verification status
        await prisma.article.update({
          where: { id: newArticle.id },
          data: {
            verificationStatus: 'failed'
          }
        });
        console.error(`Article ${newArticle.id} verification failed:`, error);
      });
    
    // Return the article immediately, verification status will be updated via websocket
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: "Could not create article." });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const article = await prisma.article.findUnique({
      where: { 
        id: Number(id)
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Get blockchain verification status
    const blockchainVerification = await blockchainService.getVerificationStatus(article.id);
    
    // Add blockchain verification to the article response
    res.status(200).json({
      ...article,
      blockchainVerification
    });
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    res.status(500).json({ error: "Could not fetch article details" });
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
    console.error('Error verifying article:', error);
    res.status(500).json({ error: "Could not verify article" });
  }
});

export default router;