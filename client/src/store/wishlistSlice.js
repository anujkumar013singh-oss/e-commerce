import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('velore_wishlist')) || [];
  } catch { return []; }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() },
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload;
      const idx = state.items.indexOf(id);
      if (idx > -1) state.items.splice(idx, 1);
      else state.items.push(id);
    },
    setWishlist: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
