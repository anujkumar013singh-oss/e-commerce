import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon, selectCartTotal } from '../store/cartSlice';
import { HiXMark, HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const { items, coupon, discount } = useSelector((state) => state.cart);
  const { subtotal, shipping, total } = useSelector(selectCartTotal);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'VELORE11') {
      dispatch(applyCoupon({ code, discount: Math.round(subtotal * 0.11) }));
      setCouponMsg('Coupon applied! 11% off');
      setCouponInput('');
    } else if (code === 'FREESHIP') {
      dispatch(applyCoupon({ code, discount: shipping }));
      setCouponMsg('Free shipping applied!');
      setCouponInput('');
    } else {
      setCouponMsg('Invalid coupon code');
    }
    setTimeout(() => setCouponMsg(''), 3000);
  };

  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    dispatch(updateQuantity({ ...item, quantity: newQty }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#FFFFFF] z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2C2C2C]/10">
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide">
                Cart ({items.length})
              </h2>
              <button onClick={onClose} className="text-[#2C2C2C]/60 hover:text-[#0A0A0A] transition-colors">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-[#2C2C2C]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-[#2C2C2C]/60 font-display text-lg tracking-wide">Your cart is empty</p>
                  <button onClick={onClose} className="btn-gold mt-5 text-xs px-6 py-2">
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={`${item.product}-${item.size}-${item.color}-${idx}`} className="flex gap-4 bg-white p-3 rounded-sm">
                      <div className="w-20 h-24 shrink-0 bg-[#F5F5F5] overflow-hidden">
                        <img
                          src={item.image || 'https://via.placeholder.com/200x240?text=No+Image'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-body text-[#0A0A0A] truncate">{item.name}</h4>
                        <p className="text-[10px] text-[#2C2C2C]/50 font-mono mt-0.5">
                          {item.size && `Size: ${item.size}`}{item.size && item.color ? ' | ' : ''}{item.color && `Color: ${item.color}`}
                        </p>
                        <p className="text-sm font-bold text-[#0A0A0A] mt-1">₹{item.price}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[#2C2C2C]/20">
                            <button
                              onClick={() => handleQtyChange(item, -1)}
                              className="px-2 py-1 text-[#2C2C2C]/60 hover:text-[#0A0A0A] transition-colors"
                            >
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-xs font-mono border-x border-[#2C2C2C]/20">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item, 1)}
                              className="px-2 py-1 text-[#2C2C2C]/60 hover:text-[#0A0A0A] transition-colors"
                            >
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item))}
                            className="text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#2C2C2C]/10 px-6 py-5 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 bg-white border border-[#2C2C2C]/20 px-3 py-2 text-sm text-[#0A0A0A] outline-none focus:border-[#D94F3D] transition-colors placeholder:text-[#2C2C2C]/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#D94F3D] text-white px-4 py-2 text-xs tracking-wider font-bold hover:bg-[#b33d2e] transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs font-mono tracking-wide ${couponMsg.includes('Invalid') ? 'text-[#D94F3D]' : 'text-green-600'}`}>
                    {couponMsg}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#2C2C2C]/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#2C2C2C]/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 text-xs">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#D94F3D]">
                      <span>Discount ({coupon})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#0A0A0A] font-bold text-base pt-2 border-t border-[#2C2C2C]/10">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="flex-1 text-center border border-[#D94F3D] text-[#0A0A0A] py-3 text-xs tracking-wider font-bold hover:bg-[#D94F3D] hover:text-white transition-all duration-300"
                  >
                    VIEW CART
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex-1 text-center bg-[#D94F3D] text-white py-3 text-xs tracking-wider font-bold hover:bg-[#b33d2e] transition-all duration-300"
                  >
                    CHECKOUT
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
