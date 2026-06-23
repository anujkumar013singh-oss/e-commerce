import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/authSlice';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

import Home from './pages/Home';
import Trending from './pages/Trending';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import SizeGuide from './pages/SizeGuide';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]"><div className="w-8 h-8 border-2 border-[#D94F3D] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]"><div className="w-8 h-8 border-2 border-[#D94F3D] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') {
    window.location.href = '/login';
    return null;
  }
  return children;
}

function PublicLayout({ children }) {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  return (
    <>
      <Navbar onCartClick={() => setCartDrawerOpen(true)} />
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <main className="min-h-screen bg-[#FFFFFF] pt-[64px]">{children}</main>
      <Footer />
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <main className="min-h-screen bg-[#FFFFFF]">{children}</main>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/trending" element={<PublicLayout><Trending /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
        <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />
        <Route path="/orders" element={<PublicLayout><ProtectedRoute><MyOrders /></ProtectedRoute></PublicLayout>} />
        <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
        <Route path="/size-guide" element={<PublicLayout><SizeGuide /></PublicLayout>} />
        <Route path="/shipping-policy" element={<PublicLayout><ShippingPolicy /></PublicLayout>} />
        <Route path="/return-policy" element={<PublicLayout><ReturnPolicy /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminRoute><AdminDashboard /></AdminRoute></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminRoute><AdminProducts /></AdminRoute></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminRoute><AdminOrders /></AdminRoute></AdminLayout>} />
      </Routes>
    </AnimatePresence>
  );
}
