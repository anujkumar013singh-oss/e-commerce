import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

import { trackOrder } from '../utils/api';
import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiCheck,
  HiChevronDown
} from 'react-icons/hi2';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from 'react-icons/fa6';

const subjectOptions = [
  { label: 'Order Issue', value: 'order' },
  { label: 'Return / Exchange', value: 'return' },
  { label: 'Product Query', value: 'product' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Other', value: 'other' }
];

const orderStages = [
  { key: 'placed', label: 'ORDER PLACED' },
  { key: 'confirmed', label: 'CONFIRMED' },
  { key: 'packed', label: 'PACKED' },
  { key: 'shipped', label: 'SHIPPED' },
  { key: 'out_for_delivery', label: 'OUT FOR DELIVERY' },
  { key: 'delivered', label: 'DELIVERED' }
];

const stageOrder = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [trackingId, setTrackingId] = useState('');
  const [trackingMobile, setTrackingMobile] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/[\s-]/g, ''))) errs.phone = 'Invalid phone number';
    if (!form.subject) errs.subject = 'Please select a subject';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      await axios.post('/api/contact', form);
      setSubmitResult({ type: 'success', message: 'Message sent successfully! We\'ll get back to you shortly.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send message. Please try again later.';
      setSubmitResult({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim() || !trackingMobile.trim()) {
      setTrackingError('Please enter both Order ID and Mobile Number.');
      setTrackingResult(null);
      return;
    }
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingResult(null);
    try {
      const data = await trackOrder(trackingId.trim(), trackingMobile.trim());
      const order = data.order;
      const timestamps = {};
      if (order.statusHistory) {
        order.statusHistory.forEach((entry) => {
          timestamps[entry.status] = entry.timestamp;
        });
      }
      setTrackingResult({ ...order, timestamps });
    } catch (err) {
      setTrackingError(err?.response?.data?.message || 'No order found. Please check your Order ID and mobile number.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStageStatus = (stageKey) => {
    if (!trackingResult) return 'pending';
    const currentIndex = stageOrder.indexOf(trackingResult.status?.toLowerCase().replace(/\s+/g, '_'));
    const stageIndex = stageOrder.indexOf(stageKey);
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[#D94F3D] text-xs tracking-[0.3em] font-mono mb-3">GET IN TOUCH</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0A0A0A] tracking-wide">Contact Us</h1>
          <div className="mt-4 h-[2px] w-12 bg-[#D94F3D] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-8 md:p-10"
          >
            <h2 className="font-display text-2xl text-[#0A0A0A] tracking-wide mb-8">Reach Out</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D94F3D]/10 flex items-center justify-center shrink-0">
                  <HiEnvelope className="w-5 h-5 text-[#D94F3D]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">EMAIL</p>
                  <a href="mailto:support@velore.in" className="text-sm text-[#0A0A0A] hover:text-[#D94F3D] transition-colors duration-300">
                    support@velore.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D94F3D]/10 flex items-center justify-center shrink-0">
                  <HiPhone className="w-5 h-5 text-[#D94F3D]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">PHONE</p>
                  <a href="tel:+919654673316" className="text-sm text-[#0A0A0A] hover:text-[#D94F3D] transition-colors duration-300">
                    +91 96546 73316
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D94F3D]/10 flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-5 h-5 text-[#D94F3D]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">WHATSAPP</p>
                  <a
                    href="https://wa.me/919654673316"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0A0A0A] hover:text-[#D94F3D] transition-colors duration-300"
                  >
                    Chat with us
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D94F3D]/10 flex items-center justify-center shrink-0">
                  <HiMapPin className="w-5 h-5 text-[#D94F3D]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">LOCATION</p>
                  <p className="text-sm text-[#0A0A0A]">Mumbai, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D94F3D]/10 flex items-center justify-center shrink-0">
                  <HiClock className="w-5 h-5 text-[#D94F3D]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">BUSINESS HOURS</p>
                  <p className="text-sm text-[#0A0A0A]">Mon – Sat, 10 AM – 7 PM IST</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[#2C2C2C]/10">
              <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-4">FOLLOW US</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: FaInstagram, href: 'https://instagram.com/velore' },
                  { icon: FaFacebookF, href: 'https://facebook.com/velore' },
                  { icon: FaPinterestP, href: 'https://pinterest.com/velore' },
                  { icon: FaTwitter, href: 'https://twitter.com/velore' }
                ].map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#D94F3D]/30 flex items-center justify-center text-[#D94F3D] hover:bg-[#D94F3D] hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 space-y-5">
              <h2 className="font-display text-2xl text-[#0A0A0A] tracking-wide mb-6">Send a Message</h2>

              {submitResult && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    submitResult.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitResult.type === 'success' ? (
                    <HiCheckCircle className="w-5 h-5 shrink-0" />
                  ) : (
                    <HiXCircle className="w-5 h-5 shrink-0" />
                  )}
                  {submitResult.message}
                </div>
              )}

              <div>
                <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">FULL NAME *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full bg-[#FFFFFF] border px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 placeholder:text-[#2C2C2C]/30 ${
                    errors.name ? 'border-[#D94F3D]' : 'border-transparent focus:border-[#D94F3D]'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-[10px] text-[#D94F3D] mt-1 font-mono">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">EMAIL *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full bg-[#FFFFFF] border px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 placeholder:text-[#2C2C2C]/30 ${
                    errors.email ? 'border-[#D94F3D]' : 'border-transparent focus:border-[#D94F3D]'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-[10px] text-[#D94F3D] mt-1 font-mono">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">PHONE *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full bg-[#FFFFFF] border px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 placeholder:text-[#2C2C2C]/30 ${
                    errors.phone ? 'border-[#D94F3D]' : 'border-transparent focus:border-[#D94F3D]'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-[10px] text-[#D94F3D] mt-1 font-mono">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">SUBJECT *</label>
                <div className="relative">
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`w-full bg-[#FFFFFF] border px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 appearance-none cursor-pointer ${
                      errors.subject ? 'border-[#D94F3D]' : 'border-transparent focus:border-[#D94F3D]'
                    } ${!form.subject ? 'text-[#2C2C2C]/30' : ''}`}
                  >
                    <option value="" disabled>Select a subject</option>
                    {subjectOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="text-[#0A0A0A]">{opt.label}</option>
                    ))}
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40 pointer-events-none" />
                </div>
                {errors.subject && <p className="text-[10px] text-[#D94F3D] mt-1 font-mono">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">MESSAGE *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full bg-[#FFFFFF] border px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 resize-none placeholder:text-[#2C2C2C]/30 ${
                    errors.message ? 'border-[#D94F3D]' : 'border-transparent focus:border-[#D94F3D]'
                  }`}
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-[10px] text-[#D94F3D] mt-1 font-mono">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-black w-full text-xs py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <p className="text-[#D94F3D] text-xs tracking-[0.3em] font-mono mb-3">NEED UPDATES?</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#0A0A0A] tracking-wide">Track Your Order</h2>
            <div className="mt-3 h-[2px] w-12 bg-[#D94F3D] mx-auto" />
            <p className="text-sm text-[#2C2C2C]/60 mt-4 max-w-md mx-auto leading-relaxed">
              Enter your Order ID and registered mobile number to check your order status.
            </p>
          </div>

          <form onSubmit={handleTrack} className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">ORDER ID / TRACKING ID</label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => { setTrackingId(e.target.value); setTrackingError(null); }}
                placeholder="VLR-2025-XXXXX"
                className="w-full bg-[#FFFFFF] border border-transparent focus:border-[#D94F3D] px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 placeholder:text-[#2C2C2C]/30"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/60 mb-2">REGISTERED MOBILE NUMBER</label>
              <input
                type="tel"
                value={trackingMobile}
                onChange={(e) => { setTrackingMobile(e.target.value); setTrackingError(null); }}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FFFFFF] border border-transparent focus:border-[#D94F3D] px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors duration-300 placeholder:text-[#2C2C2C]/30"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="w-full bg-[#D94F3D] text-white py-3.5 text-xs tracking-[0.2em] font-bold hover:bg-[#b33d2e] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {trackingLoading ? 'CHECKING...' : 'CHECK STATUS'}
            </button>
          </form>

          {trackingError && (
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-[#D94F3D]">
              <HiXCircle className="w-5 h-5 shrink-0" />
              {trackingError}
            </div>
          )}

          {trackingResult && (
            <div className="mt-10 pt-8 border-t border-[#2C2C2C]/10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">ORDER ID</p>
                  <p className="text-sm font-mono text-[#0A0A0A]">{trackingResult.trackingId || trackingResult.orderId || trackingId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">STATUS</p>
                  <p className="text-sm font-mono text-[#D94F3D] font-bold">
                    {(trackingResult.status || 'PENDING').toUpperCase().replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-1 md:gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {orderStages.map((stage, idx) => {
                  const status = getStageStatus(stage.key);
                  const timestamp = trackingResult.timestamps?.[stage.key];
                  return (
                    <div key={stage.key} className="flex flex-col items-center min-w-0 shrink-0">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all duration-500 ${
                            status === 'completed'
                              ? 'bg-[#D94F3D] border-[#D94F3D] text-white'
                              : status === 'active'
                              ? 'bg-[#D94F3D]/10 border-[#D94F3D] text-[#D94F3D]'
                              : 'bg-white border-[#2C2C2C]/20 text-[#2C2C2C]/40'
                          }`}
                        >
                          {status === 'completed' ? (
                            <HiCheck className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        {idx < orderStages.length - 1 && (
                          <div
                            className={`w-8 md:w-16 lg:w-24 h-[2px] transition-all duration-500 ${
                              status === 'completed' ? 'bg-[#D94F3D]' : 'bg-[#2C2C2C]/20'
                            }`}
                          />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p
                          className={`text-[9px] md:text-[10px] font-mono tracking-wider whitespace-nowrap transition-colors duration-500 ${
                            status === 'completed' || status === 'active'
                              ? 'text-[#D94F3D] font-bold'
                              : 'text-[#2C2C2C]/40'
                          }`}
                        >
                          {stage.label}
                        </p>
                        {timestamp && (
                          <p className="text-[8px] text-[#2C2C2C]/30 mt-0.5 whitespace-nowrap">
                            {new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {trackingResult.estimatedDelivery && (
                <div className="mt-6 text-center">
                  <p className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C]/50 mb-1">ESTIMATED DELIVERY</p>
                  <p className="text-sm font-display text-[#0A0A0A]">
                    {new Date(trackingResult.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </section>
    </motion.div>
  );
}
