import express from 'express';
import { login, getUserInfo, getUserById } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, getUserInfo);
router.get('/:id', getUserById); // Add this line

export default router;