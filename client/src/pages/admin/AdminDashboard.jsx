import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  HiChartBar, HiCube, HiShoppingBag, HiClipboardDocumentList,
  HiArrowLeftOnRectangle
} from 'react-icons/hi2';

const statusBadge = (status) => {
  const map = {
    placed: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-700',
    packed: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
  };
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiChartBar, exact: true },
  { to: '/admin/products', label: 'Products', icon: HiCube, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: HiClipboardDocumentList, exact: false },
];

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?redirect=/admin', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const { data: res } = await axios.get('/api/admin/dashboard');
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchDashboard();
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStockProducts || [];

  return (
    <motion.div
      className="min-h-screen bg-[#FFFFFF] flex font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <aside className="w-64 bg-white border-r border-[#F5F5F5] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#F5F5F5]">
          <Link to="/" className="font-display text-2xl text-[#0A0A0A] tracking-[0.1em]">VELORE</Link>
          <p className="text-[#D94F3D] text-xs tracking-widest mt-0.5">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const active = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#D94F3D]/10 text-[#D94F3D] font-medium'
                    : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C] hover:bg-[#FFFFFF]'
                }`}
              >
                <link.icon className="text-lg" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#F5F5F5]">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors"
          >
            <HiArrowLeftOnRectangle className="text-lg" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#F5F5F5] px-8 py-4">
          <h1 className="font-display text-2xl text-[#0A0A0A]">Dashboard</h1>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-[#D94F3D]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="bg-white rounded-xl p-5 border border-[#F5F5F5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase">Total Orders</span>
                    <div className="w-9 h-9 rounded-lg bg-[#D94F3D]/10 flex items-center justify-center">
                      <HiShoppingBag className="text-[#D94F3D]" />
                    </div>
                  </div>
                  <p className="font-display text-3xl text-[#0A0A0A]">{stats.totalOrders ?? '-'}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#F5F5F5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase">Total Revenue</span>
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <HiChartBar className="text-green-600" />
                    </div>
                  </div>
                  <p className="font-display text-3xl text-[#0A0A0A]">
                    ₹{stats.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '-'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#F5F5F5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase">Products</span>
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <HiCube className="text-blue-600" />
                    </div>
                  </div>
                  <p className="font-display text-3xl text-[#0A0A0A]">{stats.totalProducts ?? '-'}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#F5F5F5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase">Customers</span>
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                      <HiClipboardDocumentList className="text-purple-600" />
                    </div>
                  </div>
                  <p className="font-display text-3xl text-[#0A0A0A]">{stats.totalCustomers ?? '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-xl border border-[#F5F5F5] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F5F5F5]">
                    <h3 className="font-display text-lg text-[#0A0A0A]">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-12 text-[#2C2C2C]/40 text-sm">No orders yet</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[#2C2C2C]/50 text-xs tracking-widest uppercase">
                            <th className="px-5 py-3 font-medium">Order ID</th>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Items</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                          {recentOrders.slice(0, 10).map((order) => (
                            <tr key={order._id} className="text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors">
                              <td className="px-5 py-3 font-mono text-xs">#{order._id?.slice(-8).toUpperCase()}</td>
                              <td className="px-5 py-3">{order.shipping?.name || order.user?.name || '—'}</td>
                              <td className="px-5 py-3">{order.items?.length || 0}</td>
                              <td className="px-5 py-3">₹{order.total ? Number(order.total).toLocaleString('en-IN') : '—'}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(order.status)}`}>
                                  {order.status || 'placed'}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-[#2C2C2C]/60">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#F5F5F5] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F5F5F5]">
                    <h3 className="font-display text-lg text-[#0A0A0A]">Low Stock Alert</h3>
                  </div>
                  <div className="divide-y divide-[#F5F5F5]">
                    {lowStock.length === 0 ? (
                      <div className="text-center py-12 text-[#2C2C2C]/40 text-sm">All products are well-stocked</div>
                    ) : (
                      lowStock.map((product) => (
                        <div key={product._id} className="px-5 py-3.5 flex items-center gap-3">
                          <div className="w-10 h-13 rounded bg-[#FFFFFF] overflow-hidden shrink-0">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/40x52'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-[#2C2C2C] truncate">{product.name}</p>
                            <p className="text-xs text-red-500 mt-0.5">
                              {product.totalStock || product.stock || 0} in stock
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </motion.div>
  );
}
