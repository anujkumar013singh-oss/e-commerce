import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logoutUser } from '../store/authSlice';
import {
  HiUser, HiShoppingBag, HiHeart, HiArrowRightOnRectangle,
  HiShieldCheck, HiCube, HiClipboardDocumentList
} from 'react-icons/hi2';

export default function Account() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const links = [
    { label: 'My Orders', icon: HiShoppingBag, path: '/orders', desc: 'View your order history' },
    { label: 'Wishlist', icon: HiHeart, path: '/wishlist', desc: 'Products you have saved' },
    ...(user?.role === 'admin' ? [
      { label: 'Admin Dashboard', icon: HiShieldCheck, path: '/admin', desc: 'Manage your store' },
      { label: 'Manage Products', icon: HiCube, path: '/admin/products', desc: 'Add or edit products' },
      { label: 'Manage Orders', icon: HiClipboardDocumentList, path: '/admin/orders', desc: 'View and update orders' },
    ] : []),
  ];

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="pt-28 pb-14 max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[#D94F3D] flex items-center justify-center">
            <HiUser className="w-6 h-6 text-[#D94F3D]" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-[#0A0A0A] tracking-wide">My Account</h1>
            <p className="text-sm text-[#2C2C2C]/60 font-mono mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="bg-white/60 border border-[#2C2C2C]/10 p-6 md:p-8 mb-8">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#D94F3D] mb-4">PROFILE</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-wider text-[#2C2C2C]/50 mb-1">NAME</p>
              <p className="text-sm text-[#0A0A0A] font-medium">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-wider text-[#2C2C2C]/50 mb-1">EMAIL</p>
              <p className="text-sm text-[#0A0A0A] font-medium">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-wider text-[#2C2C2C]/50 mb-1">PHONE</p>
              <p className="text-sm text-[#0A0A0A] font-medium">{user?.phone || '—'}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group flex items-start gap-4 bg-white/60 border border-[#2C2C2C]/10 p-5 hover:border-[#D94F3D]/40 transition-all duration-300"
            >
              <link.icon className="w-5 h-5 text-[#D94F3D] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-[#0A0A0A] group-hover:text-[#D94F3D] transition-colors">{link.label}</h3>
                <p className="text-xs text-[#2C2C2C]/50 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[#D94F3D] hover:text-[#b33d2e] transition-colors font-mono tracking-wider"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          SIGN OUT
        </button>
      </section>
    </motion.div>
  );
}
