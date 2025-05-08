import { createSlice } from "@reduxjs/toolkit";

const getWishlistFromLocalStorage = (userId) => {
    try {
        const data = localStorage.getItem(`wishlist_v1_${userId}`);
        if (!data) return [];

        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to parse wishlist", error);
        return [];
    }
};

const saveWishlistToLocalStorage = (userId, items) => {
    try {
        localStorage.setItem(`wishlist_v1_${userId}`, JSON.stringify(items));
    } catch (error) {
        console.error("Failed to save wishlist", error);
    }
};

const initialState = {
    items: [],
    currentUserId: null,
    status: "idle",
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        initializeWishlist(state, action) {
            const userId = action.payload;
            state.status = "loading";
            state.items = getWishlistFromLocalStorage(userId);
            state.currentUserId = userId;
            state.status = "succeeded";
        },
        addToWishlist(state, action) {
            const { item, userId } = action.payload;
            const exists = state.items.some((i) => i.id === item.id);

            if (!exists) {
                state.items.push(item);
                saveWishlistToLocalStorage(userId, state.items);
            }
        },
        removeFromWishlist(state, action) {
            const { id, userId } = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
            saveWishlistToLocalStorage(userId, state.items);
        },
        clearWishlist(state, action) {
            const userId = action.payload;
            state.items = [];
            if (userId) {
                localStorage.removeItem(`wishlist_v1_${userId}`);
            }
            state.currentUserId = null;
        },
        mergeWishlists(state, action) {
            const { userId, serverItems } = action.payload;
            const localItems = state.items;

            const mergedItemsMap = new Map();

            serverItems.forEach((item) => {
                mergedItemsMap.set(item.id, item);
            });

            // Add local items (will overwrite if same id)
            localItems.forEach((item) => {
                mergedItemsMap.set(item.id, item);
            });

            state.items = Array.from(mergedItemsMap.values());
            saveWishlistToLocalStorage(userId, state.items);
        },
        handleLogout(state) {
            // Keep items in memory but disconnect from user
            state.currentUserId = null;
        },
    },
});

// Export actions
export const {
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    mergeWishlists,
    handleLogout,
} = wishlistSlice.actions;

// Enhanced selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (id) => (state) =>
    state.wishlist.items.some((item) => item.id === id);
export const selectWishlistStatus = (state) => state.wishlist.status;
export const selectCurrentWishlistUserId = (state) =>
    state.wishlist.currentUserId;

// Enhanced middleware with error handling
export const wishlistPersistMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    if (
        [
            wishlistSlice.actions.addToWishlist.type,
            wishlistSlice.actions.removeFromWishlist.type,
            wishlistSlice.actions.initializeWishlist.type,
            wishlistSlice.actions.clearWishlist.type,
            wishlistSlice.actions.mergeWishlists.type,
        ].includes(action.type)
    ) {
        const { wishlist } = store.getState();
        if (wishlist.currentUserId) {
            try {
                saveWishlistToLocalStorage(
                    wishlist.currentUserId,
                    wishlist.items
                );
            } catch (error) {
                console.error("Failed to persist wishlist", error);
            }
        }
    }

    return result;
};

export default wishlistSlice.reducer;
