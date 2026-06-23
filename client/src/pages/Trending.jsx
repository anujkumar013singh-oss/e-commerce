import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { fetchTrending } from '../utils/api';
import { HiChevronDown, HiMagnifyingGlass } from 'react-icons/hi2';

const filterCategories = ['All', 'Casual Shirts', 'Polo T-Shirts', 'Kurtas', 'Trousers', 'Makeup', "Women's Dresses"];

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Price Low → High', value: 'price_asc' },
  { label: 'Price High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' }
];

const heroBg = 'https://veirdo.in/cdn/shop/files/Artboard_8_30.jpg?v=1758348679';

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('trending');
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTrending();
        const items = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(items);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load trending products.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeFilter !== 'All') {
      result = result.filter((p) => {
        const category = (p.category || '').toLowerCase().replace(/[-\s']/g, '');
        const filterVal = activeFilter.toLowerCase().replace(/[-\s']/g, '');
        return category === filterVal;
      });
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [products, activeFilter, sort]);

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-[#1a1a1a]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white text-xs md:text-sm tracking-[0.3em] font-mono mb-4"
          >
            CURATED FOR YOU
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-display text-6xl md:text-7xl lg:text-8xl text-white tracking-wide"
          >
            WHAT'S TRENDING
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 h-[2px] w-16 bg-[#D94F3D]"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-6 text-white/60 text-sm md:text-base tracking-wide font-body max-w-lg"
          >
            Discover the styles everyone is talking about — from everyday essentials to standout pieces.
          </motion.p>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-[#FFFFFF] border-b border-[#2C2C2C]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 text-xs tracking-wider font-mono rounded-full border transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-[#D94F3D] text-white border-[#D94F3D]'
                      : 'bg-transparent text-[#2C2C2C]/60 border-[#2C2C2C]/20 hover:border-[#2C2C2C]/60 hover:text-[#0A0A0A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-1.5 text-xs tracking-wider font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/70 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300"
              >
                {sortOptions.find((o) => o.value === sort)?.label || 'Sort'}
                <HiChevronDown className={`w-3 h-3 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#2C2C2C]/10 shadow-xl z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSort(option.value); setSortOpen(false); }}
                        className={`block w-full text-left px-4 py-2.5 text-xs tracking-wider font-mono transition-colors duration-200 ${
                          sort === option.value
                            ? 'bg-[#D94F3D] text-white'
                            : 'text-[#2C2C2C]/70 hover:bg-[#FFFFFF] hover:text-[#0A0A0A]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-16 h-16 rounded-full bg-[#D94F3D]/10 flex items-center justify-center mb-5">
              <HiMagnifyingGlass className="w-7 h-7 text-[#D94F3D]" />
            </div>
            <p className="text-lg font-display text-[#2C2C2C]/80 tracking-wide mb-2">Something went wrong</p>
            <p className="text-sm text-[#2C2C2C]/50 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-black text-xs"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {!loading && !error && <ProductGrid products={filtered} />}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
              <HiMagnifyingGlass className="w-8 h-8 text-[#2C2C2C]/40" />
            </div>
            <p className="text-lg font-display text-[#2C2C2C]/60 tracking-wide">No products match this filter</p>
            <p className="text-sm text-[#2C2C2C]/40 mt-1">Try a different category.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="btn-black text-xs mt-6"
            >
              VIEW ALL
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
