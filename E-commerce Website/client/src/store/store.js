import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import uiReducer from "../slices/uiSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer
  },
});

export default store;