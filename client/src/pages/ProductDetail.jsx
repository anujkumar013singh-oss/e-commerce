import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { fetchProduct, fetchProducts } from '../utils/api';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import {
  HiOutlineHeart, HiHeart, HiMinus, HiPlus, HiXMark
} from 'react-icons/hi2';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const sizeChart = [
  { size: 'XS', chest: '34"', waist: '28"', hip: '34"', shoulder: '17"' },
  { size: 'S', chest: '36"', waist: '30"', hip: '36"', shoulder: '18"' },
  { size: 'M', chest: '38"', waist: '32"', hip: '38"', shoulder: '19"' },
  { size: 'L', chest: '40"', waist: '34"', hip: '40"', shoulder: '20"' },
  { size: 'XL', chest: '42"', waist: '36"', hip: '42"', shoulder: '21"' },
  { size: 'XXL', chest: '44"', waist: '38"', hip: '44"', shoulder: '22"' }
];

function CountdownTimer({ targetDate }) {
  const calcRemaining = useCallback(() => {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }, [targetDate]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(interval);
  }, [calcRemaining]);

  const pad = (n) => String(n).padStart(2, '0');

  if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#D94F3D]">
      <span>LIMITED TIME OFFER — Ends in:</span>
      <span className="bg-[#D94F3D]/10 px-2 py-1 rounded font-bold">{pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}</span>
    </div>
  );
}

function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#FFFFFF] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#2C2C2C]/60 hover:text-[#0A0A0A] transition-colors">
              <HiXMark className="w-5 h-5" />
            </button>
            <h2 className="font-display text-2xl text-[#0A0A0A] tracking-wide mb-6">SIZE GUIDE</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2C2C2C]/10">
                    <th className="py-3 pr-4 font-display text-[#0A0A0A] tracking-wider">Size</th>
                    <th className="py-3 pr-4 font-display text-[#0A0A0A] tracking-wider">Chest</th>
                    <th className="py-3 pr-4 font-display text-[#0A0A0A] tracking-wider">Waist</th>
                    <th className="py-3 pr-4 font-display text-[#0A0A0A] tracking-wider">Hip</th>
                    <th className="py-3 font-display text-[#0A0A0A] tracking-wider">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="border-b border-[#2C2C2C]/5">
                      <td className="py-3 pr-4 font-bold text-[#0A0A0A]">{row.size}</td>
                      <td className="py-3 pr-4 text-[#2C2C2C]/70">{row.chest}</td>
                      <td className="py-3 pr-4 text-[#2C2C2C]/70">{row.waist}</td>
                      <td className="py-3 pr-4 text-[#2C2C2C]/70">{row.hip}</td>
                      <td className="py-3 text-[#2C2C2C]/70">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-xs text-[#2C2C2C]/50 tracking-wide">Measurements are in inches. If you're between sizes, we recommend sizing up for a relaxed fit.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const swatchColors = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1B2838' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Tan', hex: '#D2B48C' }
];

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const imageRef = useRef(null);
  const [zoomOrigin, setZoomOrigin] = useState('center center');

  const isWishlisted = wishlistItems.includes(product?._id);
  const images = product?.images?.length ? product.images : [product?.image || 'https://via.placeholder.com/600x800?text=No+Image'];
  const discountedPrice = product?.discountedPrice || product?.price || 0;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(id);
        const p = data.product || data;
        setProduct(p);
        setSelectedImage(0);
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);

        if (p.tags?.[0] || p.category) {
          try {
            const cat = p.tags?.[0] || p.category;
            const relatedData = await fetchProducts({ tags: cat, limit: 6 });
            const items = Array.isArray(relatedData) ? relatedData : relatedData.products || relatedData.data || [];
            setRelated(items.filter((r) => (r._id || r.id) !== (p._id || p.id)).slice(0, 6));
          } catch {}
        }
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !product) return;
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || product.image,
      price: discountedPrice,
      size: selectedSize,
      color: selectedColor,
      quantity
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    dispatch(toggleWishlist(product._id));
  };

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {loading && (
        <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <div className="animate-pulse">
              <div className="aspect-[3/4] bg-[#F5F5F5] rounded" />
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-24 bg-[#F5F5F5] rounded" />
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-20 bg-[#F5F5F5] rounded" />
              <div className="h-10 w-64 bg-[#F5F5F5] rounded" />
              <div className="h-4 w-40 bg-[#F5F5F5] rounded" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-16 bg-[#F5F5F5] rounded-full" />
                ))}
              </div>
              <div className="h-8 w-36 bg-[#F5F5F5] rounded" />
              <div className="h-6 w-full bg-[#F5F5F5] rounded" />
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#F5F5F5]" />
                ))}
              </div>
              <div className="h-12 w-full bg-[#F5F5F5] rounded" />
              <div className="h-12 w-full bg-[#F5F5F5] rounded" />
            </div>
          </div>
        </section>
      )}

      {error && (
        <section className="pt-32 pb-20 flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#D94F3D]/10 flex items-center justify-center mb-5">
            <HiXMark className="w-7 h-7 text-[#D94F3D]" />
          </div>
          <p className="text-lg font-display text-[#2C2C2C]/80 tracking-wide mb-2">Something went wrong</p>
          <p className="text-sm text-[#2C2C2C]/50 mb-6">{error}</p>
          <button onClick={() => navigate('/shop')} className="btn-black text-xs">
            BACK TO SHOP
          </button>
        </section>
      )}

      {!loading && !error && product && (
        <>
          <section className="pt-28 pb-14 max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-10 md:gap-14">
              {/* Left — Image Gallery */}
              <div>
                <div
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomOrigin('center center')}
                  className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5] cursor-crosshair rounded"
                >
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{ transform: 'scale(1.5)', transformOrigin: zoomOrigin }}
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-[#D94F3D] text-white text-[10px] font-mono tracking-wider px-3 py-1 rounded-full z-10">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-20 h-24 shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                          i === selectedImage ? 'border-[#D94F3D]' : 'border-transparent hover:border-[#2C2C2C]/20'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Product Info */}
              <div className="flex flex-col">
                <p className="text-[10px] tracking-[0.2em] font-bold text-[#0A0A0A] uppercase mb-2">
                  {product.category || product.tags?.[0] || 'VELORE'}
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A] tracking-wide leading-tight mb-3">
                  {product.name}
                </h1>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm text-[#2C2C2C]/70 font-mono">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="text-sm text-[#2C2C2C]/40">({product.reviewCount} Reviews)</span>
                    )}
                  </div>
                )}

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/shop?tag=${encodeURIComponent(tag)}`}
                        className="text-[10px] font-mono tracking-wider px-3 py-1.5 bg-[#D94F3D] text-white rounded-full hover:bg-[#b33d2e] transition-colors"
                      >
                        {tag.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    {product.discountPercent > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-[#0A0A0A]">₹{discountedPrice}</span>
                        <span className="text-lg text-[#2C2C2C]/40 line-through">₹{product.price}</span>
                        <span className="text-[11px] font-mono text-white bg-[#D94F3D] px-2 py-0.5 rounded font-bold">
                          {product.discountPercent}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-[#0A0A0A]">₹{product.price}</span>
                    )}
                  </div>
                </div>

                {/* Countdown Timer */}
                {product.saleEndsAt && <CountdownTimer targetDate={product.saleEndsAt} />}

                <div className="h-px bg-[#2C2C2C]/10 my-5" />

                {/* Color Selector */}
                <div className="mb-5">
                  <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">
                    COLOR: <span className="text-[#0A0A0A] font-bold uppercase">{selectedColor || 'SELECT'}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(product.colors || swatchColors).map((color) => {
                      const hex = typeof color === 'string' ? color : color.hex;
                      const name = typeof color === 'string' ? color : color.name;
                      const isWhite = hex.toLowerCase() === '#ffffff';
                      return (
                        <button
                          key={name || hex}
                          onClick={() => setSelectedColor(name || hex)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === (name || hex)
                              ? 'border-[#D94F3D] scale-110'
                              : 'border-transparent hover:border-[#2C2C2C]/30'
                          } ${isWhite ? 'border-[#2C2C2C]/20' : ''}`}
                          style={{ backgroundColor: hex }}
                          title={name || hex}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70">
                      SIZE: <span className="text-[#0A0A0A] font-bold uppercase">{selectedSize || 'SELECT'}</span>
                    </p>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[10px] font-mono tracking-wider text-[#D94F3D] underline underline-offset-2 hover:text-[#b8944a] transition-colors"
                    >
                      SIZE GUIDE
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] h-10 px-3 text-xs font-mono tracking-wider border transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-[#D94F3D] text-white border-[#D94F3D]'
                            : 'bg-transparent text-[#2C2C2C]/70 border-[#2C2C2C]/20 hover:border-[#2C2C2C]/60 hover:text-[#0A0A0A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-xs font-mono tracking-wider text-[#2C2C2C]/70 mb-3">QUANTITY</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#2C2C2C]/20">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <HiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center text-sm font-mono text-[#0A0A0A] border-x border-[#2C2C2C]/20">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <HiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {product.stock !== undefined && product.stock <= 10 && (
                      <span className="text-[10px] font-mono text-[#D94F3D]">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 mb-5">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !selectedColor}
                    className="w-full h-12 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className="w-full h-12 border border-[#D94F3D] text-[#D94F3D] text-xs tracking-[0.2em] font-mono hover:bg-[#D94F3D]/5 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    {isWishlisted ? (
                      <><HiHeart className="w-4 h-4" /> REMOVE FROM WISHLIST</>
                    ) : (
                      <><HiOutlineHeart className="w-4 h-4" /> ADD TO WISHLIST</>
                    )}
                  </button>
                </div>

                {/* Shipping / Returns */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-[#2C2C2C]/60">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Free delivery on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#2C2C2C]/60">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Easy 7-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* You Might Also Like */}
          {related.length > 0 && (
            <section className="pb-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-[#2C2C2C]/10" />
                <h2 className="font-display text-xl md:text-2xl text-[#0A0A0A] tracking-wide whitespace-nowrap">
                  YOU MIGHT ALSO LIKE
                </h2>
                <div className="h-px flex-1 bg-[#2C2C2C]/10" />
              </div>
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {related.map((item) => (
                  <div key={item._id || item.id} className="w-48 md:w-56 shrink-0">
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </motion.div>
  );
}
