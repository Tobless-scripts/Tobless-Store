/**
 * Selector for cart open state
 * @param {Object} state - The Redux state
 * @returns {boolean} - Whether the cart is open
 */
export const selectIsCartOpen = (state) => state.ui.isCartOpen;

/**
 * Selector for wishlist open state
 * @param {Object} state - The Redux state
 * @returns {boolean} - Whether the wishlist is open
 */
export const selectIsWishlistOpen = (state) => state.ui.isWishlistOpen;

/**
 * Selector for any panel open state (cart or wishlist)
 * @param {Object} state - The Redux state
 * @returns {boolean} - Whether any panel is open
 */
export const selectIsAnyPanelOpen = (state) =>
    state.ui.isCartOpen || state.ui.isWishlistOpen;

/**
 * Selector for search open state
 * @param {Object} state - The Redux state
 * @returns {boolean} - Whether any panel is open
 */
export const selectIsSearchPanelOpen = (state) => state.ui.isSearchOpen;

/**
 * Selector for getting the entire UI state
 * @param {Object} state - The Redux state
 * @returns {Object} - The complete UI state
 */
export const selectUIState = (state) => state.ui;

// Optional: Memoized version using Reselect
import { createSelector } from "@reduxjs/toolkit";

/**
 * Memoized selector for cart status with additional derived data
 * @type {Selector}
 */
export const selectCartStatus = createSelector(
    [selectIsCartOpen],
    (isCartOpen) => ({
        isOpen: isCartOpen,
        status: isCartOpen ? "open" : "closed",
        ariaLabel: isCartOpen ? "Cart is open" : "Cart is closed",
    })
);

/**
 * Memoized selector for wishlist status with additional derived data
 * @type {Selector}
 */
export const selectWishlistStatus = createSelector(
    [selectIsWishlistOpen],
    (isWishlistOpen) => ({
        isOpen: isWishlistOpen,
        status: isWishlistOpen ? "open" : "closed",
        ariaLabel: isWishlistOpen ? "Wishlist is open" : "Wishlist is closed",
    })
);
