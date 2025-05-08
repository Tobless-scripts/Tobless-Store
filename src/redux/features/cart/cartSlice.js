// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const getCartFromLocalStorage = (userId) => {
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
};

const initialState = {
    items: [],
    checkOutReady: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartFromLocalStorage(state, action) {
            state.items = action.payload || [];
        },
        addToCart(state, action) {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity || 1;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                });
            }
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        proceedToCheckout(state) {
            state.checkOutReady = true;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    proceedToCheckout,
    setCartFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
