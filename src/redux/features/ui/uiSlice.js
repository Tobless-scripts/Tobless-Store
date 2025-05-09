import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    isWishlistOpen: false,
    isSearchOpen: false,
    isMobileMenuOpen: false,
    isLoginModalOpen: false,
    isSearchPanelOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        openWishlist: (state) => {
            state.isWishlistOpen = true;
        },
        closeWishlist: (state) => {
            state.isWishlistOpen = false;
        },
        toggleWishlist: (state) => {
            state.isWishlistOpen = !state.isWishlistOpen;
        },
        toggleSearchPanel: (state) => {
            state.isSearchOpen = !state.isSearchPanelOpen;
        },

        closeAllPanels: (state) => {
            return {
                ...state,
                isCartOpen: false,
                isWishlistOpen: false,
                isSearchOpen: false,
                isMobileMenuOpen: false,
                isSearchPanelOpen: false,
            };
        },
    },
});

export const {
    openCart,
    closeCart,
    toggleCart,
    openWishlist,
    closeWishlist,
    toggleWishlist,
    closeAllPanels,
    toggleSearchPanel,
} = uiSlice.actions;

export const selectIsCartOpen = (state) => state.ui.isCartOpen;
export const selectIsWishlistOpen = (state) => state.ui.isWishlistOpen;

export default uiSlice.reducer;
