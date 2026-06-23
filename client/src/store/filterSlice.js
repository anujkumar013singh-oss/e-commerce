import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    category: '',
    minPrice: 0,
    maxPrice: 5000,
    sizes: [],
    colors: [],
    fits: [],
    minDiscount: 0,
    tags: [],
    sort: 'trending',
    search: ''
  },
  reducers: {
    setFilter: (state, action) => { return { ...state, ...action.payload }; },
    clearFilters: () => ({ category: '', minPrice: 0, maxPrice: 5000, sizes: [], colors: [], fits: [], minDiscount: 0, tags: [], sort: 'trending', search: '', look: '' }),
    toggleSize: (state, action) => {
      const size = action.payload;
      if (state.sizes.includes(size)) state.sizes = state.sizes.filter(s => s !== size);
      else state.sizes.push(size);
    },
    toggleColor: (state, action) => {
      const color = action.payload;
      if (state.colors.includes(color)) state.colors = state.colors.filter(c => c !== color);
      else state.colors.push(color);
    },
    toggleTag: (state, action) => {
      const tag = action.payload;
      if (state.tags.includes(tag)) state.tags = state.tags.filter(t => t !== tag);
      else state.tags.push(tag);
    }
  }
});

export const { setFilter, clearFilters, toggleSize, toggleColor, toggleTag } = filterSlice.actions;
export default filterSlice.reducer;
