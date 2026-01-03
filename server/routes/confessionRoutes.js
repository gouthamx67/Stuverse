import express from 'express';
import { getConfessions, createConfession, likeConfession } from '../controllers/confessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getConfessions);
router.post('/', protect, createConfession);
router.put('/:id/like', protect, likeConfession);

export default router;
