import express from 'express';
import { getLostItems, createLostItem, resolveLostItem } from '../controllers/lostItemController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

import upload from '../config/cloudinary.js';

router.route('/')
    .get(optionalProtect, getLostItems)
    .post(protect, upload.single('image'), createLostItem);

router.route('/:id/resolve')
    .put(protect, resolveLostItem);

export default router;
