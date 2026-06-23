import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const productsCount = await Product.countDocuments();
    const customersCount = await User.countDocuments({ role: 'user' });
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');
    const lowStock = await Product.find({ 'sizes.stock': { $lte: 5 } }).limit(10);

    res.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        productsCount,
        customersCount
      },
      recentOrders,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const results = await Promise.all(
      files.map(file => uploadToCloudinary(file.buffer, {
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1600, crop: 'fill', quality: 'auto' }]
      }))
    );
    const urls = results.map(r => r.secure_url);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
