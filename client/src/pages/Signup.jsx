import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { registerUser, verifyOtp, resendOtp, clearError, resetOtp } from '../store/authSlice';

const sliderImages = [
  'https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FWhat_is_E_commerce_and_What_are_its_Applications_2_d2eb0d4402.jpg&w=4500&q=90',
  'https://salestechstar.com/wp-content/uploads/2019/12/shopping-apps.jpg',
  'https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2023-02/parcel-paper-cartons-with-shopping-cart-logo-trolley-laptop-keyboard-min.jpg',
  'https://fluentsupport.com/wp-content/uploads/2022/06/Customer_satisfaction_Definition_importance__examples_01-1.jpg'
];

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, otpSent, otpEmail, otpLoading, otpError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
    return () => { dispatch(resetOtp()); };
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
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) errs.email = 'Invalid email format';
    if (form.phone && !/^\+?[\d\s-]{7,15}$/.test(form.phone.trim())) errs.phone = 'Invalid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.terms = 'You must agree to the Terms & Conditions';
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
    dispatch(registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    dispatch(verifyOtp({ email: otpEmail, otp: code }));
  };

  const handleResend = () => {
    dispatch(resendOtp({ email: otpEmail }));
  };

  if (otpSent) {
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
              <h1 className="font-display text-7xl lg:text-8xl text-white tracking-[0.15em]">VELORE</h1>
            </div>
          </div>

          <div className="w-full lg:w-[58%] flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              <div className="lg:hidden text-center mb-8">
                <h1 className="font-display text-5xl text-[#0A0A0A] tracking-[0.12em]">VELORE</h1>
                <p className="text-[#D94F3D] text-sm tracking-widest mt-1">LUXURY FASHION</p>
              </div>

              <h2 className="font-display text-3xl text-[#0A0A0A] mb-2">Verify Your Email</h2>
              <p className="text-[#2C2C2C]/70 text-sm mb-2">
                Enter the 6-digit code sent to <span className="font-medium text-[#D94F3D]">{otpEmail}</span>
              </p>

              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
                  {otpError}
                </div>
              )}

              <div className="flex justify-center gap-2.5 my-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-mono font-bold border-2 border-[#F5F5F5] rounded-xl outline-none transition-colors focus:border-[#D94F3D] text-[#0A0A0A] bg-white"
                  />
                ))}
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={otpLoading || otp.join('').length !== 6}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading && (
                  <svg className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24" />
                )}
                VERIFY &amp; CONTINUE
              </button>

              <p className="text-center text-sm text-[#2C2C2C]/60 mt-6">
                Didn't receive the code?{' '}
                <button onClick={handleResend} disabled={otpLoading} className="text-[#D94F3D] hover:text-[#B89850] transition-colors font-medium disabled:opacity-50">
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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
            <h1 className="font-display text-7xl lg:text-8xl text-white tracking-[0.15em]">VELORE</h1>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {sliderImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40'}`}
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

            <h2 className="font-display text-3xl text-[#0A0A0A] mb-2">Create Account</h2>
            <p className="text-[#2C2C2C]/70 text-sm mb-8">Join the Velore family</p>

            {errors.server && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{errors.server}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-[#F5F5F5]'} rounded-full py-3 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`} />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-3">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Email</label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-[#F5F5F5]'} rounded-full py-3 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-3">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Phone <span className="text-[#2C2C2C]/30 normal-case">(optional)</span></label>
                <div className="relative">
                  <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-[#F5F5F5]'} rounded-full py-3 pl-11 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-3">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={`w-full bg-white border ${errors.password ? 'border-red-400' : 'border-[#F5F5F5]'} rounded-full py-3 pl-11 pr-11 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors">
                    {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-3">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-400' : 'border-[#F5F5F5]'} rounded-full py-3 pl-11 pr-11 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none transition-colors focus:border-[#D94F3D]`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors">
                    {showConfirm ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-3">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={() => { setAgreeTerms(!agreeTerms); setErrors((prev) => ({ ...prev, terms: '' })); }} className="mt-1 h-4 w-4 rounded border-[#F5F5F5] text-[#D94F3D] focus:ring-[#D94F3D] accent-[#D94F3D]" />
                <label htmlFor="terms" className="text-xs text-[#2C2C2C]/70 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-[#D94F3D] underline hover:text-[#B89850] transition-colors">Terms &amp; Conditions</button>{' '}
                  and{' '}
                  <button type="button" className="text-[#D94F3D] underline hover:text-[#B89850] transition-colors">Privacy Policy</button>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs ml-1">{errors.terms}</p>}

              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading && (
                  <svg className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24" />
                )}
                CREATE ACCOUNT
              </button>
            </form>

            <p className="text-center text-sm text-[#2C2C2C]/60 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-[#D94F3D] hover:text-[#B89850] transition-colors font-medium">Sign in &rarr;</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
