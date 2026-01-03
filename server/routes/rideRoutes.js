import express from 'express';
import { getRides, createRide, joinRide, leaveRide } from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getRides)
    .post(protect, createRide);

router.put('/:id/join', protect, joinRide);
router.put('/:id/leave', protect, leaveRide);

export default router;
