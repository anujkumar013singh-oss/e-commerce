import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  HiCube, HiChartBar, HiClipboardDocumentList, HiArrowLeftOnRectangle,
  HiMagnifyingGlass, HiXMark, HiCheck
} from 'react-icons/hi2';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiChartBar, exact: true },
  { to: '/admin/products', label: 'Products', icon: HiCube, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: HiClipboardDocumentList, exact: false },
];

const statusConfig = {
  placed: { label: 'Placed', color: 'bg-gray-100 text-gray-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  packed: { label: 'Packed', color: 'bg-yellow-100 text-yellow-700' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

const statusFlow = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function AdminOrders() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?redirect=/admin/orders', { replace: true });
      return;
    }
  }, [user, navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/all');
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') fetchOrders();
  }, [user, fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filtered = orders.filter((order) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const orderId = order._id?.slice(-8).toLowerCase();
    const tracking = (order.trackingId || '').toLowerCase();
    const customer = (order.shipping?.name || order.user?.name || '').toLowerCase();
    return orderId.includes(q) || tracking.includes(q) || customer.includes(q);
  });

  if (!user || user.role !== 'admin') return null;

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
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors">
            <HiArrowLeftOnRectangle className="text-lg" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#F5F5F5] px-8 py-4">
          <h1 className="font-display text-2xl text-[#0A0A0A]">Orders</h1>
        </header>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}><HiXMark className="text-red-500 hover:text-red-700" /></button>
            </div>
          )}

          <div className="relative mb-6 max-w-xs">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, tracking, or customer..."
              className="w-full bg-white border border-[#F5F5F5] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none focus:border-[#D94F3D] transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-[#D94F3D]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#2C2C2C]/40">No orders found</div>
              ) : (
                filtered.map((order) => {
                  const currentStatus = order.status || 'placed';
                  const statusInfo = statusConfig[currentStatus] || statusConfig.placed;
                  const statusIdx = statusFlow.indexOf(currentStatus);
                  const expanded = expandedId === order._id;

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-xl border border-[#F5F5F5] overflow-hidden transition-shadow hover:shadow-sm"
                    >
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-[#FFFFFF] transition-colors"
                      >
                        <span className="font-mono text-xs text-[#2C2C2C]/50 w-20">
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm text-[#2C2C2C] truncate">
                          {order.shipping?.name || order.user?.name || '—'}
                        </span>
                        <span className="text-sm text-[#2C2C2C]/70 w-8 text-center">
                          {order.items?.length || 0}
                        </span>
                        <span className="text-sm font-medium w-28">
                          ₹{order.total ? Number(order.total).toLocaleString('en-IN') : '—'}
                        </span>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium w-24 text-center ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-[#2C2C2C]/50 w-24">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })
                            : '—'}
                        </span>
                        <select
                          value={currentStatus}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingStatus === order._id}
                          className="text-xs border border-[#F5F5F5] rounded-lg px-2 py-1.5 bg-white text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors disabled:opacity-50 cursor-pointer w-28"
                        >
                          {statusFlow.map((s) => (
                            <option key={s} value={s}>
                              {statusConfig[s].label}
                            </option>
                          ))}
                        </select>
                        <svg
                          className={`w-4 h-4 text-[#2C2C2C]/30 transition-transform duration-200 ${
                            expanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[#F5F5F5] bg-[#FFFFFF]/50 px-5 py-5">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-3 font-medium">
                                    Order Items
                                  </h4>
                                  <div className="space-y-3">
                                    {(order.items || []).map((item, i) => (
                                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-[#F5F5F5]">
                                        <div className="w-12 h-16 rounded bg-[#FFFFFF] overflow-hidden shrink-0">
                                          <img
                                            src={item.image || item.images?.[0] || 'https://via.placeholder.com/48x64'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-[#2C2C2C] font-medium truncate">
                                            {item.name || item.product?.name || 'Product'}
                                          </p>
                                          <p className="text-xs text-[#2C2C2C]/60 mt-0.5">
                                            {item.size ? `Size: ${item.size}` : ''}
                                            {item.quantity ? ` × ${item.quantity}` : ''}
                                          </p>
                                          <p className="text-xs text-[#D94F3D] mt-0.5">
                                            ₹{item.price ? Number(item.price).toLocaleString('en-IN') : '—'}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                      <p className="text-sm text-[#2C2C2C]/40">No items</p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-3 font-medium">
                                      Customer Details
                                    </h4>
                                    <div className="bg-white rounded-lg p-3.5 border border-[#F5F5F5] space-y-1.5 text-sm">
                                      <p><span className="text-[#2C2C2C]/50">Name:</span> {order.shipping?.name || order.user?.name || '—'}</p>
                                      <p><span className="text-[#2C2C2C]/50">Email:</span> {order.shipping?.email || order.user?.email || '—'}</p>
                                      <p><span className="text-[#2C2C2C]/50">Phone:</span> {order.shipping?.phone || order.user?.phone || '—'}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-3 font-medium">
                                      Shipping Address
                                    </h4>
                                    <div className="bg-white rounded-lg p-3.5 border border-[#F5F5F5] text-sm">
                                      {order.shipping?.address ? (
                                        <p className="text-[#2C2C2C]">
                                          {order.shipping.address}
                                          {order.shipping.city && <span>, {order.shipping.city}</span>}
                                          {order.shipping.state && <span>, {order.shipping.state}</span>}
                                          {order.shipping.pincode && <span> — {order.shipping.pincode}</span>}
                                        </p>
                                      ) : (
                                        <p className="text-[#2C2C2C]/40">No address provided</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-2 font-medium">
                                        Payment
                                      </h4>
                                      <div className="bg-white rounded-lg p-3.5 border border-[#F5F5F5] text-sm">
                                        <p className="flex items-center gap-1.5">
                                          <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                          {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus || 'Pending'}
                                        </p>
                                        <p className="text-[#2C2C2C]/50 text-xs mt-1">
                                          {order.paymentMethod || '—'}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-2 font-medium">
                                        Tracking ID
                                      </h4>
                                      <div className="bg-white rounded-lg p-3.5 border border-[#F5F5F5] text-sm">
                                        <p className="font-mono text-xs text-[#2C2C2C]">
                                          {order.trackingId || 'Not assigned'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-xs tracking-widest text-[#2C2C2C]/50 uppercase mb-3 font-medium">
                                      Status History
                                    </h4>
                                    <div className="bg-white rounded-lg p-3.5 border border-[#F5F5F5]">
                                      <div className="space-y-2">
                                        {statusFlow.map((s, i) => {
                                          const isReached = i <= statusIdx;
                                          const isCurrent = i === statusIdx;
                                          return (
                                            <div key={s} className="flex items-center gap-3">
                                              <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                  isReached
                                                    ? isCurrent
                                                      ? 'bg-[#D94F3D]'
                                                      : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                }`}
                                              >
                                                {isReached ? (
                                                  <HiCheck className="text-white text-xs" />
                                                ) : (
                                                  <span className="text-[10px] text-gray-400">{i + 1}</span>
                                                )}
                                              </div>
                                              <span
                                                className={`text-sm ${
                                                  isReached ? 'text-[#2C2C2C] font-medium' : 'text-[#2C2C2C]/30'
                                                }`}
                                              >
                                                {statusConfig[s].label}
                                              </span>
                                              {isCurrent && (
                                                <span className="text-[10px] text-[#D94F3D] ml-auto font-medium tracking-wider">
                                                  CURRENT
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
