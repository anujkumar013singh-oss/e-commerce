import { createSlice, createSelector } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const cart = localStorage.getItem('velore_cart');
    return cart ? JSON.parse(cart) : { items: [], coupon: null, discount: 0 };
  } catch { return { items: [], coupon: null, discount: 0 }; }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i.product === product && i.size === size && i.color === color);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, name: action.payload.name, image: action.payload.image, price: action.payload.price, size, color, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.product !== action.payload.product || i.size !== action.payload.size || i.color !== action.payload.color);
    },
    updateQuantity: (state, action) => {
      const { product, size, color, quantity } = action.payload;
      const item = state.items.find(i => i.product === product && i.size === size && i.color === color);
      if (item) { item.quantity = quantity; }
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;

const selectCartState = (state) => state.cart;

export const selectCartTotal = createSelector(
  [selectCartState],
  (cart) => {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 49;
    return { subtotal, shipping, discount: cart.discount, total: subtotal + shipping - cart.discount };
  }
);

export default cartSlice.reducer;
