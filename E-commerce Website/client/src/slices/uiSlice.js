import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWishlistOpen: false,
  isFilterSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Wishlist Actions
    toggleWishlist: (state) => {
      state.isWishlistOpen = !state.isWishlistOpen;
    },
    openWishlist: (state) => {
      state.isWishlistOpen = true;
    },
    closeWishlist: (state) => {
      state.isWishlistOpen = false;
    },
    
    // Filter Sidebar Actions
    toggleFilterSidebar: (state) => {
      state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
    },
    setFilterSidebarOpen: (state, action) => {
      state.isFilterSidebarOpen = action.payload;
    }
  },
});

export const { 
  toggleWishlist, 
  openWishlist, 
  closeWishlist, 
  toggleFilterSidebar, 
  setFilterSidebarOpen 
} = uiSlice.actions;

export default uiSlice.reducer;