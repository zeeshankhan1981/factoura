import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';
import databaseService from '../services/databaseService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await databaseService.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await databaseService.prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await databaseService.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;