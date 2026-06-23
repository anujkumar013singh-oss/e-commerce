import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import nodemailer from 'nodemailer';

const getTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const sendOtpEmail = async (email, otp) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Velore" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Your Velore OTP Code',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-family: 'Cormorant Garamond', serif; color: #D94F3D; font-size: 32px; letter-spacing: 4px; margin: 0;">VELORE</h1>
          <p style="color: #D94F3D; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">LUXURY FASHION</p>
        </div>
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 12px;">Welcome to Velore!</h2>
        <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
          Use the OTP below to verify your email address. This code expires in 10 minutes.
        </p>
        <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #D94F3D; font-family: 'Space Mono', monospace;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not create this account, please ignore this email.
        </p>
      </div>
    `
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      if (!existing.verified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await Otp.deleteMany({ email });
        await Otp.create({ email, otp, expiresAt });
        try {
          await sendOtpEmail(email, otp);
        } catch {
          return res.status(500).json({ message: 'Failed to send OTP. Check your email settings or try again.' });
        }
        return res.json({ message: 'OTP resent to your email', email });
      }
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password, verified: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    try {
      await sendOtpEmail(email, otp);
    } catch {
      await User.findByIdAndDelete(user._id);
      await Otp.deleteMany({ email });
      return res.status(500).json({ message: 'Failed to send OTP. Check your email settings or try again.' });
    }

    res.status(201).json({ message: 'OTP sent to your email', email: user.email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};