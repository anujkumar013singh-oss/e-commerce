import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import {
  removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, selectCartTotal
} from '../store/cartSlice';
import {
  HiMinus, HiPlus, HiTrash, HiArrowLeft, HiCheck, HiXMark, HiShoppingBag
} from 'react-icons/hi2';

const VALID_COUPONS = {
  VELORE11: { type: 'percent', value: 11, label: '11% Off' },
  FREESHIP: { type: 'freeshipping', value: 0, label: 'Free Shipping' }
};

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({
      product: item.product,
      size: item.size,
      color: item.color,
      quantity: newQty
    }));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-5 border-b border-[#2C2C2C]/10 last:border-b-0"
    >
      <Link to={`/product/${item.product}`} className="w-24 h-32 shrink-0 bg-[#F5F5F5] overflow-hidden">
        <img
          src={item.image || 'https://via.placeholder.com/200x266?text=No+Image'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${item.product}`}
              className="text-sm font-display text-[#0A0A0A] tracking-wide hover:underline truncate"
            >
              {item.name}
            </Link>
            <button
              onClick={() => dispatch(removeFromCart({ product: item.product, size: item.size, color: item.color }))}
              className="text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors shrink-0"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1">
            {item.size && <span className="text-xs text-[#2C2C2C]/60 font-mono">Size: {item.size}</span>}
            {item.color && (
              <span className="flex items-center gap-1.5 text-xs text-[#2C2C2C]/60 font-mono">
                Color: {item.color}
                <span
                  className="w-3 h-3 rounded-full inline-block border border-[#2C2C2C]/20"
                  style={{ backgroundColor: item.color }}
                />
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[#2C2C2C]/20">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiMinus className="w-3 h-3" />
            </button>
            <span className="w-10 h-8 flex items-center justify-center text-xs font-mono text-[#0A0A0A] border-x border-[#2C2C2C]/20">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
            >
              <HiPlus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm font-bold text-[#0A0A0A] font-mono">₹{item.price * item.quantity}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, discount: appliedDiscount } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const { subtotal, shipping, discount, total } = useSelector(selectCartTotal);

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMsg({ type: 'error', text: 'Enter a coupon code.' });
      return;
    }
    const valid = VALID_COUPONS[code];
    if (!valid) {
      setCouponMsg({ type: 'error', text: `"${code}" is not a valid coupon.` });
      return;
    }
    let discountAmount = 0;
    if (valid.type === 'percent') {
      discountAmount = Math.round(subtotal * (valid.value / 100));
    } else if (valid.type === 'freeshipping') {
      discountAmount = shipping;
    }
    dispatch(applyCoupon({ code, discount: discountAmount }));
    setCouponMsg({ type: 'success', text: `Coupon "${code}" applied! ${valid.label}` });
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponMsg(null);
  };

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop" className="text-[#2C2C2C]/40 hover:text-[#0A0A0A] transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl md:text-3xl text-[#0A0A0A] tracking-wide">SHOPPING BAG</h1>
          <span className="text-xs font-mono text-[#2C2C2C]/50 mt-1">
            ({items.length} item{items.length !== 1 ? 's' : ''})
          </span>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
              <HiShoppingBag className="w-10 h-10 text-[#2C2C2C]/40" />
            </div>
            <h2 className="font-display text-2xl text-[#0A0A0A] tracking-wide mb-2">Your cart is empty</h2>
            <p className="text-sm text-[#2C2C2C]/50 mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="btn-black text-xs tracking-[0.2em]">
              SHOP NOW
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Left — Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={`${item.product}-${item.size}-${item.color}`} item={item} />
                ))}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs font-mono text-[#2C2C2C]/50 hover:text-[#D94F3D] transition-colors tracking-wider"
                >
                  CLEAR BAG
                </button>
                <Link to="/shop" className="text-xs font-mono text-[#D94F3D] hover:text-[#b8944a] transition-colors tracking-wider">
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#2C2C2C]/10 p-6 md:p-8">
                <h2 className="font-display text-lg text-[#0A0A0A] tracking-wide mb-6">ORDER SUMMARY</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2C2C2C]/70">Subtotal</span>
                    <span className="font-mono text-[#0A0A0A]">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#2C2C2C]/70">Shipping</span>
                    <span className={`font-mono ${shipping === 0 ? 'text-green-600' : 'text-[#0A0A0A]'}`}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        Discount{coupon && ` (${coupon})`}
                        <button onClick={handleRemoveCoupon} className="hover:text-[#D94F3D] transition-colors">
                          <HiXMark className="w-3.5 h-3.5" />
                        </button>
                      </span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-[#2C2C2C]/10 pt-3 mt-3">
                    <div className="flex items-center justify-between font-bold text-base">
                      <span className="text-[#0A0A0A]">Total</span>
                      <span className="font-mono text-[#0A0A0A]">₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-6 pt-6 border-t border-[#2C2C2C]/10">
                  <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">COUPON CODE</p>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <HiCheck className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-mono text-green-700">{coupon} applied</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-[#D94F3D] transition-colors">
                        <HiXMark className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter code"
                          className="flex-1 h-10 px-3 text-xs font-mono bg-white border border-[#2C2C2C]/20 outline-none focus:border-[#D94F3D] transition-colors placeholder:text-[#2C2C2C]/30"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="h-10 px-5 bg-[#D94F3D] text-white text-xs font-mono tracking-wider hover:bg-[#b33d2e] transition-colors"
                        >
                          APPLY
                        </button>
                      </div>
                      {couponMsg && (
                        <p className={`text-[11px] font-mono mt-2 ${couponMsg.type === 'error' ? 'text-[#D94F3D]' : 'text-green-600'}`}>
                          {couponMsg.text}
                        </p>
                      )}
                      <p className="text-[10px] text-[#2C2C2C]/40 mt-2 font-mono tracking-wider">
                        Try: VELORE11 for 11% off &bull; FREESHIP for free shipping
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors duration-300 mt-6"
                >
                  PROCEED TO CHECKOUT
                </button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-[#2C2C2C]/50 font-mono">
                    <HiCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>Free delivery on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#2C2C2C]/50 font-mono">
                    <HiCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>Easy 7-day returns & exchange</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#2C2C2C]/50 font-mono">
                    <HiCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>Secure checkout with Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
}
