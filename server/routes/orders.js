import express from 'express';
import { createOrder, getMyOrders, getOrder, trackOrder, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/track', trackOrder);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
