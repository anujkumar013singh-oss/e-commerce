import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import { fetchProducts } from '../utils/api';
import { setFilter, clearFilters } from '../store/filterSlice';
import {
  HiChevronDown,
  HiAdjustmentsHorizontal,
  HiXMark,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi2';

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Price Low → High', value: 'price_asc' },
  { label: 'Price High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' }
];

const categoriesForDropdown = [
  { label: 'Shirts', path: 'Casual Shirts' },
  { label: 'Polos', path: 'Polo T-Shirts' },
  { label: 'Kurtas', path: 'Kurtas' },
  { label: 'Trousers', path: 'Trousers' },
  { label: 'Pajamas', path: 'Pajamas' },
  { label: 'Makeup', path: 'Makeup' },
  { label: "Women's Dresses", path: "Women's Dresses" }
];

const heroBg = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=85';

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector((state) => state.filters);
  const skipUrlSync = useRef(false);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(filters.sort || 'trending');
  const [sortOpen, setSortOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (skipUrlSync.current) { skipUrlSync.current = false; return; }
    const cat = searchParams.get('category') || '';
    const minP = Number(searchParams.get('minPrice')) || 0;
    const maxP = Number(searchParams.get('maxPrice')) || 5000;
    const tag = searchParams.get('tag') || '';
    const look = searchParams.get('look') || '';
    const s = searchParams.get('sort') || 'trending';
    const searchQ = searchParams.get('search') || '';
    const pageParam = Number(searchParams.get('page')) || 1;
    const fitsParam = searchParams.get('fits') || '';
    const sizesParam = searchParams.get('sizes') || '';
    const colorsParam = searchParams.get('colors') || '';
    const discountParam = Number(searchParams.get('minDiscount')) || 0;

    dispatch(setFilter({
      category: cat,
      minPrice: minP,
      maxPrice: maxP,
      tags: tag ? tag.split(',').map(t => t.replace(/\+/g, ' ')) : [],
      fits: fitsParam ? fitsParam.split(',') : [],
      sizes: sizesParam ? sizesParam.split(',') : [],
      colors: colorsParam ? colorsParam.split(',') : [],
      minDiscount: discountParam,
      look,
      sort: s,
      search: searchQ
    }));

    setSort(s);
    setPage(pageParam);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        const cat = searchParams.get('category') || '';
        const minP = Number(searchParams.get('minPrice')) || 0;
        const maxP = Number(searchParams.get('maxPrice')) || 5000;
        const tag = searchParams.get('tag') || '';
        const look = searchParams.get('look') || '';
        const searchQ = searchParams.get('search') || '';
        const fitsParam = searchParams.get('fits') || '';
        const sizesParam = searchParams.get('sizes') || '';
        const colorsParam = searchParams.get('colors') || '';
        const discountParam = Number(searchParams.get('minDiscount')) || 0;

        if (cat) params.category = cat;
        if (minP > 0) params.minPrice = minP;
        if (maxP < 5000) params.maxPrice = maxP;
        if (tag) params.tags = tag;
        if (look) params.look = look;
        if (searchQ) params.search = searchQ;
        if (fitsParam) params.fits = fitsParam;
        if (sizesParam) params.sizes = sizesParam;
        if (colorsParam) params.colors = colorsParam;
        if (discountParam > 0) params.minDiscount = discountParam;

        params.sort = sort;
        params.page = page;
        params.limit = ITEMS_PER_PAGE;

        const data = await fetchProducts(params);
        const items = Array.isArray(data) ? data : data.products || data.data || [];
        const total = data.total || data.totalCount || data.count || items.length;
        setProducts(items);
        setTotalCount(total);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams, sort, page]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.category) sp.set('category', filters.category);
    if (filters.minPrice > 0) sp.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice < 5000) sp.set('maxPrice', String(filters.maxPrice));
    if (filters.sizes.length > 0) sp.set('sizes', filters.sizes.join(','));
    if (filters.colors.length > 0) sp.set('colors', filters.colors.join(','));
    if (filters.fits.length > 0) sp.set('fits', filters.fits.join(','));
    if (filters.minDiscount > 0) sp.set('minDiscount', String(filters.minDiscount));
    if (filters.tags.length > 0) sp.set('tags', filters.tags.join(','));
    if (filters.search) sp.set('search', filters.search);
    if (filters.look) sp.set('look', filters.look);
    sp.set('sort', sort);
    sp.set('page', String(page));
    skipUrlSync.current = true;
    setSearchParams(sp, { replace: true });
  }, [filters, sort, page]);

  const handleCategoryClick = (cat) => {
    dispatch(setFilter({ category: filters.category === cat ? '' : cat }));
    setPage(1);
    setCatDropdownOpen(false);
  };

  const handleSortChange = (value) => {
    setSort(value);
    dispatch(setFilter({ sort: value }));
    setSortOpen(false);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    dispatch(clearFilters());
    setSort('trending');
    setPage(1);
  };

  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="relative h-[35vh] md:h-[40vh] overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
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
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wide"
          >
            THE COLLECTION
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 h-[2px] w-16 bg-[#D94F3D]"
          />
        </div>
      </section>

      <section className="relative bg-[#FFFFFF] border-b border-[#2C2C2C]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="relative inline-block">
            <button
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D94F3D] text-white text-xs tracking-[0.2em] font-mono hover:bg-[#b33d2e] transition-colors duration-300"
            >
              BROWSE CATEGORIES
              <HiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {catDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-[#2C2C2C]/10 shadow-xl z-20">
                  {categoriesForDropdown.map((cat) => (
                    <button
                      key={cat.path}
                      onClick={() => handleCategoryClick(cat.path)}
                      className={`block w-full text-left px-5 py-3 text-xs tracking-wider font-mono transition-colors duration-200 border-b border-[#2C2C2C]/5 last:border-b-0 ${
                        filters.category === cat.path
                          ? 'bg-[#D94F3D]/10 text-[#0A0A0A] font-bold'
                          : 'text-[#2C2C2C]/70 hover:bg-[#FFFFFF] hover:text-[#0A0A0A]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar />
          </div>

          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-[#FFFFFF] overflow-y-auto shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg text-[#0A0A0A] tracking-wide">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-[#2C2C2C]/60 hover:text-[#0A0A0A]">
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#2C2C2C]/20 text-xs tracking-wider font-mono text-[#2C2C2C]/70 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300"
                >
                  <HiAdjustmentsHorizontal className="w-4 h-4" />
                  FILTERS
                </button>
                <p className="text-xs text-[#2C2C2C]/50 font-mono tracking-wide">
                  {loading ? 'Loading...' : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/70 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300"
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
                          onClick={() => handleSortChange(option.value)}
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

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
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
                  <HiXMark className="w-7 h-7 text-[#D94F3D]" />
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

            {!loading && !error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 px-4">
                <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
                  <HiAdjustmentsHorizontal className="w-8 h-8 text-[#2C2C2C]/40" />
                </div>
                <p className="text-lg font-display text-[#2C2C2C]/60 tracking-wide">No products found</p>
                <p className="text-sm text-[#2C2C2C]/40 mt-1">Try different filters.</p>
                <button
                  onClick={handleReset}
                  className="btn-black text-xs mt-6"
                >
                  RESET FILTERS
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <ProductGrid products={products} />

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pb-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-4 py-2 text-xs tracking-wider font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/70 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <HiChevronLeft className="w-3.5 h-3.5" />
                      PREV
                    </button>

                    {start > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="w-9 h-9 text-xs font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300"
                        >
                          1
                        </button>
                        <span className="text-[#2C2C2C]/30 text-xs px-1">...</span>
                      </>
                    )}

                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`w-9 h-9 text-xs font-mono border transition-all duration-300 ${
                          num === page
                            ? 'bg-[#D94F3D] text-white border-[#D94F3D]'
                            : 'border-[#2C2C2C]/20 text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60'
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    {end < totalPages && (
                      <>
                        <span className="text-[#2C2C2C]/30 text-xs px-1">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9 h-9 text-xs font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/60 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-4 py-2 text-xs tracking-wider font-mono border border-[#2C2C2C]/20 text-[#2C2C2C]/70 hover:text-[#0A0A0A] hover:border-[#2C2C2C]/60 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      NEXT
                      <HiChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
