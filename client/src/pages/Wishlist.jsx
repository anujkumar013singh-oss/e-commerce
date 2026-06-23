import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { fetchProductsByIds } from '../utils/api';
import { setWishlist } from '../store/wishlistSlice';
import { HiHeart, HiArrowLeft } from 'react-icons/hi2';

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state) => state.wishlist.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (wishlistIds.length === 0) {
          setProducts([]);
          return;
        }
        const data = await fetchProductsByIds(wishlistIds);
        const items = Array.isArray(data) ? data : data.products || data.data || [];
        const validIds = items.map((p) => p._id || p.id);
        const removedCount = wishlistIds.length - validIds.length;
        if (removedCount > 0) {
          dispatch(setWishlist(validIds));
        }
        setProducts(items);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [wishlistIds]);

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="relative h-[30vh] md:h-[35vh] overflow-hidden mt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://carbookingmauritius.com/wp-content/uploads/2024/06/customer-satisfaction.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/80 text-xs md:text-sm tracking-[0.3em] font-mono mb-4"
          >
            VELORE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide"
          >
            YOUR WISHLIST
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 h-[2px] w-16 bg-[#D94F3D]"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#F5F5F5]" />
                <div className="pt-3 px-1 space-y-2">
                  <div className="h-3 w-16 bg-[#F5F5F5] rounded" />
                  <div className="h-4 w-32 bg-[#F5F5F5] rounded" />
                  <div className="h-4 w-20 bg-[#F5F5F5] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
              <HiHeart className="w-8 h-8 text-[#2C2C2C]/40" />
            </div>
            <p className="text-lg font-display text-[#2C2C2C]/60 tracking-wide">Your wishlist is empty</p>
            <p className="text-sm text-[#2C2C2C]/40 mt-1">Save your favorite products here.</p>
            <Link
              to="/shop"
              className="flex items-center gap-2 mt-8 px-6 py-3 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors duration-300"
            >
              <HiArrowLeft className="w-3.5 h-3.5" />
              START SHOPPING
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#2C2C2C]/50 font-mono tracking-wide mb-6">
              {products.length} saved product{products.length !== 1 ? 's' : ''}
            </p>
            <ProductGrid products={products} />
          </>
        )}
      </section>
    </motion.div>
  );
}
