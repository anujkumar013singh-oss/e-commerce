import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCart, selectCartTotal } from '../store/cartSlice';
import { placeOrder } from '../utils/api';
import { HiCheck, HiTruck, HiArrowPath, HiDocumentDuplicate } from 'react-icons/hi2';

const steps = [
  { num: 1, label: 'Address' },
  { num: 2, label: 'Review' },
  { num: 3, label: 'Payment' }
];

const initialAddress = {
  name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: ''
};

const UPI_ID = '9654673316@mbk';
const ADVANCE_PERCENT = 30;

function AddressForm({ address, onChange, savedAddresses, onSelectSaved }) {
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
    { key: 'phone', label: 'Phone Number', placeholder: '9876543210', required: true, type: 'tel' },
    { key: 'line1', label: 'Address Line 1', placeholder: 'House / Flat / Street', required: true },
    { key: 'line2', label: 'Address Line 2', placeholder: 'Locality / Landmark (optional)' },
    { key: 'city', label: 'City', placeholder: 'City', required: true },
    { key: 'state', label: 'State', placeholder: 'State', required: true },
    { key: 'pincode', label: 'Pincode', placeholder: '110001', required: true }
  ];

  return (
    <div>
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">SAVED ADDRESSES</p>
          <div className="space-y-2">
            {savedAddresses.map((addr, i) => (
              <button
                key={i}
                onClick={() => onSelectSaved(addr)}
                className="w-full text-left p-3 border border-[#2C2C2C]/10 hover:border-[#D94F3D] transition-colors bg-white text-xs text-[#2C2C2C]/80 leading-relaxed"
              >
                {addr.name} — {addr.line1}, {addr.city}, {addr.state} — {addr.phone}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={['line1', 'line2'].includes(f.key) ? 'md:col-span-2' : ''}>
            <label className="text-[10px] font-mono tracking-wider text-[#2C2C2C]/70 mb-1.5 block">
              {f.label}{f.required ? ' *' : ''}
            </label>
            <input
              type={f.type || 'text'}
              value={address[f.key] || ''}
              onChange={(e) => onChange({ ...address, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full h-11 px-4 text-sm bg-white border border-[#2C2C2C]/20 outline-none focus:border-[#D94F3D] transition-colors placeholder:text-[#2C2C2C]/25"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({ address, cartItems, totals, onBack }) {
  return (
    <div>
      <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">SHIPPING TO</p>
      <div className="bg-white border border-[#2C2C2C]/10 p-4 mb-8 text-sm text-[#2C2C2C]/80 leading-relaxed">
        <p className="font-semibold text-[#0A0A0A]">{address.name}</p>
        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p>{address.city}, {address.state} — {address.pincode}</p>
        <p className="font-mono text-xs mt-1">{address.phone}</p>
      </div>

      <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">ITEMS ({cartItems.length})</p>
      <div className="space-y-3 mb-8">
        {cartItems.map((item) => (
          <div key={`${item.product}-${item.size}-${item.color}`} className="flex items-center gap-3 bg-white border border-[#2C2C2C]/10 p-3">
            <img
              src={item.image || 'https://via.placeholder.com/60x80?text=No+Image'}
              alt={item.name}
              className="w-14 h-18 object-cover bg-[#F5F5F5]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display text-[#0A0A0A] truncate">{item.name}</p>
              <p className="text-[10px] font-mono text-[#2C2C2C]/50 mt-0.5">
                {item.size && `Size: ${item.size}`}{item.size && item.color ? ' | ' : ''}{item.color && `Color: ${item.color}`}
              </p>
              <p className="text-xs font-mono text-[#2C2C2C]/50">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-[#0A0A0A] font-mono shrink-0">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">ORDER TOTAL</p>
      <div className="bg-white border border-[#2C2C2C]/10 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-[#2C2C2C]/70">
          <span>Subtotal</span>
          <span className="font-mono">₹{totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-[#2C2C2C]/70">
          <span>Shipping</span>
          <span className={`font-mono ${totals.shipping === 0 ? 'text-green-600' : ''}`}>
            {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
          </span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-mono">-₹{totals.discount}</span>
          </div>
        )}
        <div className="border-t border-[#2C2C2C]/10 pt-2 flex justify-between font-bold text-[#0A0A0A]">
          <span>Total</span>
          <span className="font-mono">₹{totals.total}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="h-12 px-8 border border-[#2C2C2C]/20 text-[#2C2C2C]/70 text-xs font-mono tracking-wider hover:border-[#2C2C2C]/60 transition-colors">
          BACK
        </button>
      </div>
    </div>
  );
}

function UpiPaymentForm({ total, onSuccess, onBack, address, cartItems, totals }) {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const advanceAmount = Math.ceil(total * ADVANCE_PERCENT / 100);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Velore&am=${advanceAmount}&cu=INR&tn=Velore%20Advance%20${ADVANCE_PERCENT}%25`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleCopyTracking = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDone = async () => {
    setProcessing(true);
    setError(null);
    try {
      const order = await placeOrder({
        items: cartItems.map(i => ({ product: i.product, name: i.name, image: i.image, size: i.size, color: i.color, quantity: i.quantity, price: i.price })),
        address,
        subtotal: totals.subtotal,
        shippingCost: totals.shipping,
        discount: totals.discount,
        total,
        paymentIntentId: `UPI_${Date.now()}`,
        mobile: address.phone
      });
      dispatch(clearCart());
      onSuccess(order.order);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-1">PAY WITH UPI</p>
        <p className="font-display text-2xl text-[#0A0A0A] tracking-wide">Scan to Pay</p>
      </div>

      <div className="flex flex-col items-center bg-white border border-[#2C2C2C]/10 p-6 mb-6">
        <img src={qrUrl} alt="UPI QR Code" className="w-56 h-56 object-contain mb-4" />
        <p className="text-sm font-mono text-[#0A0A0A] font-bold tracking-wider">{UPI_ID}</p>
      </div>

      <div className="bg-[#FFF5F3] border border-[#D94F3D]/20 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <HiCheck className="w-5 h-5 text-[#D94F3D] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#0A0A0A] mb-1">
              Pay {ADVANCE_PERCENT}% Advance — ₹{advanceAmount}
            </p>
            <p className="text-xs text-[#2C2C2C]/60 leading-relaxed">
              Pay only ₹{advanceAmount} now (refundable). The remaining ₹{total - advanceAmount} will be collected at delivery.
              Your {ADVANCE_PERCENT}% advance payment is <strong>fully refundable</strong> if you cancel within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs font-mono text-[#D94F3D] mb-4 text-center">{error}</p>
      )}

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="h-12 px-8 border border-[#2C2C2C]/20 text-[#2C2C2C]/70 text-xs font-mono tracking-wider hover:border-[#2C2C2C]/60 transition-colors disabled:opacity-40"
        >
          BACK
        </button>
        <button
          onClick={handleDone}
          disabled={processing}
          className="flex-1 h-12 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              PLACING ORDER...
            </span>
          ) : (
            'DONE'
          )}
        </button>
      </div>
    </div>
  );
}

function OrderSuccess({ order }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order?.trackingId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <HiCheck className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="font-display text-2xl md:text-3xl text-[#0A0A0A] tracking-wide mb-2">ORDER PLACED!</h2>
      <p className="text-sm text-[#2C2C2C]/60 mb-6 text-center">Thank you for your purchase. Your {ADVANCE_PERCENT}% advance payment is refundable.</p>

      {order?.trackingId && (
        <div className="bg-[#FFF5F3] border border-[#D94F3D]/20 rounded-xl p-5 mb-6 w-full max-w-md">
          <p className="text-xs font-mono text-[#2C2C2C]/50 mb-2 text-center">TRACKING ID</p>
          <div className="flex items-center justify-center gap-3 bg-white border border-[#2C2C2C]/10 rounded-lg px-4 py-3">
            <span className="font-mono text-lg font-bold text-[#0A0A0A] tracking-wider">{order.trackingId}</span>
            <button
              onClick={handleCopy}
              className="p-2 text-[#D94F3D] hover:bg-[#D94F3D]/10 rounded-lg transition-colors shrink-0"
              title="Copy tracking ID"
            >
              {copied ? <HiCheck className="w-5 h-5 text-green-600" /> : <HiDocumentDuplicate className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-[#2C2C2C]/50 mt-3 text-center leading-relaxed">
            Copy this tracking ID to check your order status anytime. Visit the tracking page on our website and enter this ID along with your mobile number.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 text-xs text-[#2C2C2C]/60 mb-8">
        <div className="flex items-center gap-2">
          <HiTruck className="w-4 h-4 text-[#D94F3D]" />
          <span>You'll receive a confirmation SMS with tracking details shortly.</span>
        </div>
        <div className="flex items-center gap-2">
          <HiArrowPath className="w-4 h-4 text-[#D94F3D]" />
          <span>Easy 7-day returns — we'll pick it up from your doorstep.</span>
        </div>
        <div className="flex items-center gap-2">
          <HiArrowPath className="w-4 h-4 text-[#D94F3D]" />
          <span>Your {ADVANCE_PERCENT}% advance is refundable — cancel within 24 hours for a full refund.</span>
        </div>
      </div>

      <a href="/" className="h-12 px-10 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors inline-flex items-center">
        CONTINUE SHOPPING
      </a>
    </motion.div>
  );
}

function CheckoutContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotal);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(initialAddress);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [orderResult, setOrderResult] = useState(null);
  const [stepError, setStepError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/checkout`);
      return;
    }
    if (user?.addresses) {
      setSavedAddresses(user.addresses);
    }
  }, [user, navigate]);

  const handleAddressContinue = () => {
    setStepError(null);
    const required = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field]?.trim()) {
        setStepError('Please fill in all required fields.');
        return;
      }
    }
    if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\s/g, ''))) {
      setStepError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setStepError('Please enter a valid 6-digit pincode.');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setStep(3);
  };

  const handleOrderSuccess = (order) => {
    setOrderResult(order);
  };

  if (orderResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-8"
      >
        <section className="pt-20 pb-16 max-w-2xl mx-auto px-4">
          <OrderSuccess order={orderResult} />
        </section>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-8"
      >
        <section className="pt-20 pb-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#D94F3D] border-t-transparent rounded-full animate-spin" />
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-8"
    >
      <section className="pt-20 pb-16 max-w-3xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                    step > s.num
                      ? 'bg-green-600 text-white'
                      : step === s.num
                      ? 'bg-[#D94F3D] text-white'
                      : 'bg-[#F5F5F5] text-[#2C2C2C]/40'
                  }`}
                >
                  {step > s.num ? <HiCheck className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[10px] font-mono tracking-wider mt-1.5 ${
                  step === s.num ? 'text-[#0A0A0A] font-bold' : 'text-[#2C2C2C]/40'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 md:w-24 h-px mx-3 md:mx-4 transition-colors duration-300 ${
                  step > s.num ? 'bg-green-600' : 'bg-[#2C2C2C]/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-[#FFFFFF] border border-[#2C2C2C]/10 p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-6">SHIPPING ADDRESS</h2>
                <AddressForm
                  address={address}
                  onChange={setAddress}
                  savedAddresses={savedAddresses}
                  onSelectSaved={(addr) => setAddress({ ...initialAddress, ...addr })}
                />
                {stepError && <p className="text-xs font-mono text-[#D94F3D] mt-4">{stepError}</p>}
                <button onClick={handleAddressContinue} className="w-full h-12 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors mt-6">
                  SAVE AND CONTINUE
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-6">REVIEW ORDER</h2>
                <ReviewStep
                  address={address}
                  cartItems={cartItems}
                  totals={totals}
                  onBack={() => setStep(1)}
                />
                <button onClick={handlePlaceOrder} className="w-full h-12 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors mt-4">
                  PLACE ORDER
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2 text-center">COMPLETE PAYMENT</h2>
                <p className="text-xs text-[#2C2C2C]/50 font-mono mb-6 text-center">Scan the QR code and pay the advance amount</p>
                <UpiPaymentForm
                  total={totals.total}
                  onSuccess={handleOrderSuccess}
                  onBack={() => setStep(2)}
                  address={address}
                  cartItems={cartItems}
                  totals={totals}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}

export default function Checkout() {
  return <CheckoutContent />;
}
