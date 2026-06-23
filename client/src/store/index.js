import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    filters: filterReducer
  }
});

store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  try {
    localStorage.setItem('velore_cart', JSON.stringify(cart));
  } catch {}
  try {
    localStorage.setItem('velore_wishlist', JSON.stringify(wishlist.items));
  } catch {}
});
