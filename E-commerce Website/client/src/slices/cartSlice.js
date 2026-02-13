import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    setCart(state, action) {
      const { items, totalQuantity } = action.payload;
      state.items = items;
      state.totalQuantity = totalQuantity;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
const quantityToAdd = newItem.quantity || 1;
      const existingItem = state.items.find(item => (item.productId && item.productId._id === newItem.productId._id) || 
        (item._id && item._id === newItem._id));

      if (!existingItem) {
        state.items.push({
            ...newItem,
            quantity: quantityToAdd // Set initial quantity
        });
      } else {
        existingItem.quantity+= quantityToAdd;
      }
      state.totalQuantity+= quantityToAdd;
localStorage.setItem('cart', JSON.stringify(state))
        
    },
    removeItemFromCart(state, action) {
        const id = action.payload;
        const existingItem = state.items.find(item => item.productId._id === id);
        if (existingItem) {
            state.totalQuantity -= existingItem.quantity;
            state.items = state.items.filter(item => item.productId._id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(state))
        
    },
    updateItemQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId._id === id);

      if (existingItem) {
        const oldQuantity = existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += (quantity - oldQuantity);
      }
      localStorage.setItem('cart', JSON.stringify(state))
        
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { setCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;