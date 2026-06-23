import express from 'express';
import { getDashboard, uploadImages } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboard);
router.post('/upload', protect, adminOnly, upload.array('images', 10), uploadImages);

export default router;
