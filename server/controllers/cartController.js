import User from '../models/User.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product, size, color, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.cart.find(item => item.product.toString() === product && item.size === size && item.color === color);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product, size, color, quantity });
    }
    await user.save();
    await user.populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = quantity;
    await user.save();
    await user.populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item._id.toString() !== itemId);
    await user.save();
    await user.populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ cart: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
