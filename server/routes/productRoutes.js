import express from 'express';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/productController.js';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

import upload from '../config/cloudinary.js';

router.route('/')
    .get(optionalProtect, getProducts)
    .post(protect, upload.array('images', 3), createProduct);

router.route('/:id')
    .get(getProductById)
    .delete(protect, deleteProduct);

router.route('/:id/reviews')
    .post(protect, createReview)
    .get(getReviews);

export default router;
