import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiXMark } from 'react-icons/hi2';
import { loginUser, clearError } from '../store/authSlice';
import axios from 'axios';

const sliderImages = [
  'https://www.investopedia.com/thmb/kVxMl1DFogJNwnjMJv6zNxmuU6c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-618432992-a6784667528e4771bf8a69477a149d05.jpg',
  'https://d1di04ifehjy6m.cloudfront.net/media/filer_public/6d/64/6d6422f3-d69b-434a-8fb0-193bfc58072c/elevate_your_shopping_experience_with_orion_mall_in_bangalore.png',
  'https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhlcyUyMHNob3BwaW5nfGVufDB8fDB8fHww',
  'https://baazarkolkata.com/wp-content/uploads/2026/05/2-2.jpg',
  'https://c.files.bbci.co.uk/df1c/live/5c7b0a30-0d9d-11f1-8168-03d32f3820eb.jpg'
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', password: '', confirmPassword: '' });
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const otpInputRef = useRef(null);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, navigate, redirect]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) setErrors((prev) => ({ ...prev, server: error }));
  }, [error]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '', server: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch(loginUser({ email: form.email.trim(), password: form.password }));
  };

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep('email');
    setForgotForm({ email: '', otp: '', password: '', confirmPassword: '' });
    setForgotError('');
    setForgotLoading(false);
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setForgotStep('email');
    setForgotForm({ email: '', otp: '', password: '', confirmPassword: '' });
    setForgotError('');
    setForgotLoading(false);
  };

  useEffect(() => {
    if (forgotStep === 'otp' && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [forgotStep]);

  const handleSendOtp = async () => {
    if (!forgotForm.email.trim()) {
      setForgotError('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotForm.email.trim())) {
      setForgotError('Invalid email format');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      const { data } = await axios.post('/api/auth/send-reset-otp', { email: forgotForm.email.trim() });
      setForgotStep('otp');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotForm.otp || forgotForm.otp.length !== 6) {
      setForgotError('Please enter the 6-digit OTP');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post('/api/auth/verify-reset-otp', {
        email: forgotForm.email.trim(),
        otp: forgotForm.otp
      });
      setForgotStep('password');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotForm.password) {
      setForgotError('Enter a new password');
      return;
    }
    if (forgotForm.password.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }
    if (forgotForm.password !== forgotForm.confirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post('/api/auth/reset-password', {
        email: forgotForm.email.trim(),
        otp: forgotForm.otp,
        password: forgotForm.password
      });
      setForgotForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setForgotStep('done');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForgotForm((prev) => ({ ...prev, otp: value }));
    setForgotError('');
  };

  const renderForgotModal = () => {
    const steps = ['Email', 'Verify', 'Reset'];
    const stepIndex = forgotStep === 'email' ? 0 : forgotStep === 'otp' ? 1 : forgotStep === 'password' ? 2 : 3;

    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={closeForgot}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white w-full max-w-md rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-8 pt-8 pb-2">
          <button
            onClick={closeForgot}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#e8e8e8] transition-colors"
          >
            <HiXMark className="w-4 h-4 text-[#2C2C2C]/50" />
          </button>

          <div className="flex items-center justify-center gap-0 mb-6">
            {forgotStep === 'done' ? null : steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < stepIndex
                        ? 'bg-green-500 text-white'
                        : i === stepIndex
                        ? 'bg-[#D94F3D] text-white shadow-[0_0_0_4px_rgba(217,79,61,0.15)]'
                        : 'bg-[#F5F5F5] text-[#2C2C2C]/30'
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-mono tracking-wider ${
                    i === stepIndex ? 'text-[#D94F3D] font-medium' : 'text-[#2C2C2C]/30'
                  }`}>
                    {label.toUpperCase()}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-px mx-2 mb-5 transition-colors duration-300 ${
                    i < stepIndex ? 'bg-green-400' : 'bg-[#F5F5F5]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl text-[#0A0A0A] tracking-wide text-center">
            {forgotStep === 'email' && 'Forgot Password'}
            {forgotStep === 'otp' && 'Check Your Email'}
            {forgotStep === 'password' && 'Create New Password'}
            {forgotStep === 'done' && 'All Done!'}
          </h2>
          <p className="text-sm text-[#2C2C2C]/50 text-center mt-1 mb-6">
            {forgotStep === 'email' && 'Enter your registered email to receive a reset code.'}
            {forgotStep === 'otp' && `We sent a 6-digit code to ${forgotForm.email}`}
            {forgotStep === 'password' && 'Must be at least 6 characters.'}
          </p>
        </div>

        <div className="px-8 pb-8">
          {forgotError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-lg mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {forgotError}
            </div>
          )}

          {forgotStep === 'email' && (
            <div>
              <label className="block text-xs text-[#2C2C2C]/40 font-mono tracking-wider mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                <input
                  type="email"
                  value={forgotForm.email}
                  onChange={(e) => { setForgotForm((prev) => ({ ...prev, email: e.target.value })); setForgotError(''); }}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 outline-none transition-all focus:border-[#D94F3D] focus:shadow-[0_0_0_3px_rgba(217,79,61,0.1)]"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={forgotLoading}
                className="w-full bg-[#D94F3D] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider hover:bg-[#c14635] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5 shadow-[0_4px_14px_rgba(217,79,61,0.25)] hover:shadow-[0_6px_20px_rgba(217,79,61,0.35)] active:scale-[0.98]"
              >
                {forgotLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                SEND RESET CODE
              </button>
            </div>
          )}

          {forgotStep === 'otp' && (
            <div>
              <p className="text-xs text-[#2C2C2C]/40 text-center mb-5">
                Enter the code sent to <span className="text-[#0A0A0A] font-medium">{forgotForm.email}</span>
              </p>
              <div className="relative flex justify-center gap-3 mb-1">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-all duration-150 ${
                      forgotForm.otp[idx]
                        ? 'border-[#D94F3D] text-[#D94F3D] bg-[#D94F3D]/5 shadow-[0_0_0_3px_rgba(217,79,61,0.1)]'
                        : 'border-[#E5E5E5] text-[#2C2C2C]'
                    }`}
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    {forgotForm.otp[idx] || ''}
                  </div>
                ))}
                <input
                  ref={otpInputRef}
                  type="text"
                  value={forgotForm.otp}
                  onChange={handleOtpChange}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                    if (pasted) {
                      setForgotForm((prev) => ({ ...prev, otp: pasted }));
                      setForgotError('');
                    }
                  }}
                  maxLength={6}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default"
                  autoComplete="one-time-code"
                />
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      forgotForm.otp[idx] ? 'bg-[#D94F3D]' : 'bg-[#E5E5E5]'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={forgotLoading || forgotForm.otp.length !== 6}
                className="w-full bg-[#D94F3D] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider hover:bg-[#c14635] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(217,79,61,0.25)] hover:shadow-[0_6px_20px_rgba(217,79,61,0.35)] active:scale-[0.98]"
              >
                {forgotLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                VERIFY CODE
              </button>
              <button
                onClick={handleSendOtp}
                disabled={forgotLoading}
                className="w-full text-center text-xs text-[#2C2C2C]/40 hover:text-[#D94F3D] mt-3 transition-colors"
              >
                Didn&apos;t receive it? <span className="text-[#D94F3D] underline underline-offset-2 font-medium">Resend code</span>
              </button>
            </div>
          )}

          {forgotStep === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#2C2C2C]/40 font-mono tracking-wider mb-2">NEW PASSWORD</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input
                    type="password"
                    value={forgotForm.password}
                    onChange={(e) => { setForgotForm((prev) => ({ ...prev, password: e.target.value })); setForgotError(''); }}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 outline-none transition-all focus:border-[#D94F3D] focus:shadow-[0_0_0_3px_rgba(217,79,61,0.1)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#2C2C2C]/40 font-mono tracking-wider mb-2">CONFIRM PASSWORD</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input
                    type="password"
                    value={forgotForm.confirmPassword}
                    onChange={(e) => { setForgotForm((prev) => ({ ...prev, confirmPassword: e.target.value })); setForgotError(''); }}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 outline-none transition-all focus:border-[#D94F3D] focus:shadow-[0_0_0_3px_rgba(217,79,61,0.1)]"
                  />
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={forgotLoading}
                className="w-full bg-[#D94F3D] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider hover:bg-[#c14635] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(217,79,61,0.25)] hover:shadow-[0_6px_20px_rgba(217,79,61,0.35)] active:scale-[0.98]"
              >
                {forgotLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                RESET PASSWORD
              </button>
            </div>
          )}

          {forgotStep === 'done' && (
            <div className="text-center pt-2 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-[#0A0A0A] mb-2">Password Updated</h3>
              <p className="text-sm text-[#2C2C2C]/50 mb-6 leading-relaxed max-w-xs mx-auto">
                Your password has been reset successfully. Sign in with your new credentials.
              </p>
              <button
                onClick={closeForgot}
                className="w-full bg-[#D94F3D] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider hover:bg-[#c14635] transition-all shadow-[0_4px_14px_rgba(217,79,61,0.25)] hover:shadow-[0_6px_20px_rgba(217,79,61,0.35)] active:scale-[0.98]"
              >
                SIGN IN
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-body p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl min-h-[500px]">
        <div className="hidden lg:flex w-[42%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={sliderImages[currentSlide]}
            alt="Velore"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-7xl lg:text-8xl text-white tracking-[0.15em]">
            VELORE
          </h1>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[58%] flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-5xl text-[#0A0A0A] tracking-[0.12em]">VELORE</h1>
            <p className="text-[#D94F3D] text-sm tracking-widest mt-1">LUXURY FASHION</p>
          </div>

          <h2 className="font-display text-3xl text-[#0A0A0A] mb-2">Welcome Back</h2>
          <p className="text-[#2C2C2C]/70 text-sm mb-8">Sign in to your Velore account</p>

          {errors.server && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Email</label>
              <div className="relative">
                <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full bg-white border ${
                    errors.email ? 'border-red-400' : 'border-[#F5F5F5]'
                  } rounded-full py-3 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-3">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white border ${
                    errors.password ? 'border-red-400' : 'border-[#F5F5F5]'
                  } rounded-full py-3 pl-11 pr-11 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors"
                >
                  {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-3">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={openForgot}
                className="text-xs text-[#D94F3D] hover:text-[#b33d2e] transition-colors tracking-wider"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24" />
              )}
              SIGN IN
            </button>
          </form>

          <p className="text-center text-sm text-[#2C2C2C]/60 mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#D94F3D] hover:text-[#b33d2e] transition-colors font-medium">
              Create one &rarr;
            </Link>
          </p>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {forgotOpen && renderForgotModal()}
      </AnimatePresence>
    </motion.div>
  );
}
