import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMagnifyingGlass, HiHeart, HiShoppingBag, HiUser, HiBars3, HiXMark } from 'react-icons/hi2';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'TRENDING', path: '/trending' },
  { label: 'SHOP', path: '/shop' },
  { label: 'CONTACT', path: '/contact' }
];

const megaMenuColumns = [
  {
    title: 'By Category',
    links: [
      { label: 'Casual Shirts', path: '/shop?category=Casual+Shirts' },
      { label: 'Polo T-Shirts', path: '/shop?category=Polo+T-Shirts' },
      { label: 'Kurtas', path: '/shop?category=Kurtas' },
      { label: 'Trousers', path: '/shop?category=Trousers' },
      { label: 'Pajamas', path: '/shop?category=Pajamas' },
      { label: 'Makeup', path: '/shop?category=Makeup' },
      { label: "Women's Dresses", path: "/shop?category=Women's+Dresses" }
    ]
  },
  {
    title: 'By Price',
    links: [
      { label: 'Under ₹399', path: '/shop?maxPrice=399' },
      { label: 'Under ₹599', path: '/shop?maxPrice=599' },
      { label: 'Under ₹799', path: '/shop?maxPrice=799' },
      { label: 'Under ₹999', path: '/shop?maxPrice=999' },
      { label: '₹1000+', path: '/shop?minPrice=1000' }
    ]
  },
  {
    title: 'By Fit',
    links: [
      { label: 'Slim Fit', path: '/shop?fits=Slim' },
      { label: 'Regular Fit', path: '/shop?fits=Regular' },
      { label: 'Relaxed Fit', path: '/shop?fits=Relaxed' },
      { label: 'Oversized Fit', path: '/shop?fits=Oversized' }
    ]
  }
];

const mobileLinks = [
  { label: 'SHOP', path: '/shop' },
  { label: 'TRENDING', path: '/trending' },
  { label: 'Makeup', path: '/shop?category=Makeup' },
  { label: "Women's Dresses", path: "/shop?category=Women's+Dresses" },
  { label: 'Under ₹399', path: '/shop?maxPrice=399' },
  { label: 'Polo T-Shirt', path: '/shop?category=Polo+T-Shirts' },
  { label: 'Casual Shirt', path: '/shop?category=Casual+Shirts' },
  { label: 'CONTACT', path: '/contact' }
];

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export default function Navbar({ onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaTimeout = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector((state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  const closeAll = () => { setMobileMenu(false); setMegaOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 z-40 flex items-center transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#D94F3D]/20 shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-full">
          <Link to="/" className="select-none shrink-0 flex items-center gap-2" onClick={closeAll}>
            <img src="https://res.cloudinary.com/dhudpc4eu/image/upload/v1782193622/pixora-uploads/pixora-bg-1782193622299-arr5m4.png" alt="Velore" className="h-10 md:h-12 w-auto" />
            <span className="text-[#D94F3D] font-display text-xl md:text-2xl tracking-[0.3em]">VELORE</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) =>
              link.label === 'SHOP' ? (
                <div
                  key="shop"
                  className="relative"
                  onMouseEnter={() => { clearTimeout(megaTimeout.current); setMegaOpen(true); }}
                  onMouseLeave={() => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 150); }}
                >
                  <Link
                    to={link.path}
                    className="text-[#0A0A0A]/80 hover:text-[#D94F3D] text-xs tracking-[0.2em] transition-colors duration-300"
                    onClick={closeAll}
                  >
                    SHOP
                  </Link>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed left-0 top-16 w-full bg-white border-t border-[#D94F3D]/20 shadow-2xl"
                        onMouseEnter={() => clearTimeout(megaTimeout.current)}
                        onMouseLeave={() => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 150); }}
                      >
                        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-3 gap-12">
                          {megaMenuColumns.map((col) => (
                            <div key={col.title}>
                              <h3 className="text-[#D94F3D] font-display text-lg tracking-wider mb-5">{col.title}</h3>
                              <ul className="space-y-3">
                                {col.links.map((link) => (
                                  <li key={link.label}>
                                    <Link
                                      to={link.path}
                                      onClick={closeAll}
                                      className="text-[#0A0A0A]/60 hover:text-[#D94F3D] text-sm tracking-wide transition-all duration-300 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D94F3D] after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-[#0A0A0A]/80 hover:text-[#D94F3D] text-xs tracking-[0.2em] transition-colors duration-300"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors duration-300">
              <HiMagnifyingGlass className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="relative text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors duration-300 hidden sm:block">
              <HiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D94F3D] text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={onCartClick} className="relative text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors duration-300">
              <HiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D94F3D] text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <Link to={user ? '/account' : '/login'} className="text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors duration-300 hidden sm:block">
              {user ? (
                <div className="w-5 h-5 rounded-full bg-[#D94F3D] flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name?.[0] || user.email?.[0] || 'U'}
                </div>
              ) : (
                <HiUser className="w-5 h-5" />
              )}
            </Link>
            <button
              className="lg:hidden text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors duration-300"
              onClick={() => setMobileMenu(true)}
            >
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-[#D94F3D]/20 z-40 py-4"
          >
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4 flex items-center gap-3">
              <HiMagnifyingGlass className="text-[#D94F3D] w-5 h-5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent border-none outline-none text-[#0A0A0A] placeholder-[#0A0A0A]/30 text-sm tracking-wide font-body"
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-[#0A0A0A]/40 hover:text-[#0A0A0A] text-xs tracking-wider">
                ESC
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#D94F3D]/10">
              <Link to="/" onClick={closeAll} className="flex items-center gap-2">
                <img src="https://res.cloudinary.com/dhudpc4eu/image/upload/v1782193622/pixora-uploads/pixora-bg-1782193622299-arr5m4.png" alt="Velore" className="h-9 w-auto" />
                <span className="text-[#D94F3D] font-display text-xl tracking-[0.3em]">VELORE</span>
              </Link>
              <button onClick={closeAll} className="text-[#0A0A0A]/80 hover:text-[#D94F3D]">
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center gap-8 px-4">
              {mobileLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={link.path}
                    className="text-[#0A0A0A]/80 hover:text-[#D94F3D] text-lg tracking-[0.25em] transition-colors duration-300 font-body"
                    onClick={closeAll}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div custom={mobileLinks.length} variants={staggerItem} initial="hidden" animate="visible" className="flex items-center gap-6 mt-4">
                <Link to="/wishlist" onClick={closeAll} className="text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors">
                  <HiHeart className="w-6 h-6" />
                </Link>
                <Link to="/cart" onClick={closeAll} className="text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors">
                  <HiShoppingBag className="w-6 h-6" />
                </Link>
                <Link to={user ? '/account' : '/login'} onClick={closeAll} className="text-[#0A0A0A]/80 hover:text-[#D94F3D] transition-colors">
                  <HiUser className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
