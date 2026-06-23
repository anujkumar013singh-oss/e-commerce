import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { sendOtp, verifyOtp, resendOtp, sendResetOtp, verifyResetOtp, resetPassword } from '../controllers/otpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/send-reset-otp', sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

export default router;
