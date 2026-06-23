import nodemailer from 'nodemailer';
import Otp from '../models/Otp.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await getTransporter().sendMail({
      from: `"Velore" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Your Velore OTP Code',
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; color: #D94F3D; font-size: 32px; letter-spacing: 4px; margin: 0;">VELORE</h1>
            <p style="color: #D94F3D; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">LUXURY FASHION</p>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 12px;">Verify your email</h2>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
            Use the OTP below to complete your registration. This code expires in 10 minutes.
          </p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #D94F3D; font-family: 'Space Mono', monospace;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = createToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ user, token });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await getTransporter().sendMail({
      from: `"Velore" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Reset OTP - Velore',
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; color: #D94F3D; font-size: 32px; letter-spacing: 4px; margin: 0;">VELORE</h1>
            <p style="color: #D94F3D; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">LUXURY FASHION</p>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 12px;">Reset Your Password</h2>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
            Use the OTP below to reset your password. This code expires in 10 minutes.
          </p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #D94F3D; font-family: 'Space Mono', monospace;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send reset OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await getTransporter().sendMail({
      from: `"Velore" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Your New Velore OTP Code',
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; color: #D94F3D; font-size: 32px; letter-spacing: 4px; margin: 0;">VELORE</h1>
            <p style="color: #D94F3D; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">LUXURY FASHION</p>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 12px;">New OTP Code</h2>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
            Here is your new OTP. It expires in 10 minutes.
          </p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #D94F3D; font-family: 'Space Mono', monospace;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `
    });

    res.json({ message: 'OTP resent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
};
