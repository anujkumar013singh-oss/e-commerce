import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { HiArrowLeft, HiShoppingBag, HiCheck } from 'react-icons/hi2';

const statusConfig = {
  placed: { label: 'Placed', color: 'bg-gray-100 text-gray-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  packed: { label: 'Packed', color: 'bg-yellow-100 text-yellow-700' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

const statusFlow = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/orders', { replace: true });
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/my');
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="pt-28 pb-14 max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/account" className="text-[#2C2C2C]/50 hover:text-[#D94F3D] transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 rounded-full bg-[#D94F3D]/10 flex items-center justify-center">
            <HiShoppingBag className="w-5 h-5 text-[#D94F3D]" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-[#0A0A0A] tracking-wide">My Orders</h1>
            <p className="text-sm text-[#2C2C2C]/60 font-mono mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D94F3D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-[#2C2C2C]/10">
            <HiShoppingBag className="w-10 h-10 text-[#2C2C2C]/20 mx-auto mb-4" />
            <p className="text-[#2C2C2C]/50 font-mono text-sm tracking-wider">NO ORDERS YET</p>
            <Link
              to="/shop"
              className="inline-block mt-4 text-sm text-[#D94F3D] hover:text-[#b33d2e] transition-colors underline font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const currentStatus = order.status || 'placed';
              const statusInfo = statusConfig[currentStatus] || statusConfig.placed;
              const statusIdx = statusFlow.indexOf(currentStatus);

              return (
                <div
                  key={order._id}
                  className="bg-white border border-[#2C2C2C]/10 overflow-hidden hover:border-[#D94F3D]/30 transition-colors"
                >
                  <div className="px-5 py-4 border-b border-[#2C2C2C]/5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-[#2C2C2C]/50">
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#D94F3D]">
                          ₹{order.total ? Number(order.total).toLocaleString('en-IN') : '—'}
                        </span>
                        <span className="text-xs text-[#2C2C2C]/50">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })
                            : '—'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#2C2C2C]/40 mt-1.5 font-mono">
                      Tracking: {order.trackingId || 'Not assigned'}
                    </p>
                  </div>

                  <div className="px-5 py-3 space-y-2">
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded bg-[#FFFFFF] overflow-hidden shrink-0 border border-[#2C2C2C]/5">
                          <img
                            src={item.image || item.images?.[0] || 'https://via.placeholder.com/40x56'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-[#0A0A0A] truncate">{item.name || item.product?.name || 'Product'}</p>
                          <p className="text-xs text-[#2C2C2C]/60">
                            {item.size ? `Size: ${item.size}` : ''}
                            {item.quantity ? ` × ${item.quantity}` : ''}
                          </p>
                        </div>
                        <span className="text-sm text-[#2C2C2C]/70">
                          ₹{item.price ? Number(item.price).toLocaleString('en-IN') : '—'}
                        </span>
                      </div>
                    ))}
                    {(order.items || []).length > 3 && (
                      <p className="text-xs text-[#2C2C2C]/40 text-center pt-1">
                        +{order.items.length - 3} more item{(order.items.length - 3) !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-[#2C2C2C]/5 bg-[#FFFFFF]/50">
                    <div className="flex items-center gap-2">
                      {statusFlow.map((s, i) => {
                        const isReached = i <= statusIdx;
                        const isCurrent = i === statusIdx;
                        return (
                          <div key={s} className="flex items-center gap-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                isReached
                                  ? isCurrent
                                    ? 'bg-[#D94F3D]'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            >
                              {isReached ? (
                                <HiCheck className="text-white text-[10px]" />
                              ) : (
                                <span className="text-[8px] text-gray-400">{i + 1}</span>
                              )}
                            </div>
                            <span className={`text-[10px] ${isReached ? 'text-[#2C2C2C] font-medium' : 'text-[#2C2C2C]/30'}`}>
                              {statusConfig[s].label}
                            </span>
                            {i < statusFlow.length - 1 && (
                              <div className={`w-4 h-px mx-0.5 ${i < statusIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}
