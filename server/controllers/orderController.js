import Order from '../models/Order.js';
import crypto from 'crypto';

const generateTrackingId = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `VLR-${year}-${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const { items, address, subtotal, shippingCost, discount, total, paymentIntentId, mobile } = req.body;
    const trackingId = generateTrackingId();
    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentIntentId,
      paymentStatus: 'paid',
      status: 'placed',
      trackingId,
      mobile: mobile || address.phone,
      email: req.user.email,
      statusHistory: [{ status: 'placed', timestamp: new Date() }]
    });
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { trackingId, mobile } = req.query;
    const order = await Order.findOne({ trackingId, mobile });
    if (!order) return res.status(404).json({ message: 'No order found with that ID and mobile number' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date() } },
        ...(status === 'confirmed' && !order?.trackingId ? { trackingId: generateTrackingId() } : {})
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
