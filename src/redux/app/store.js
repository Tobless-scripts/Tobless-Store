import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import wishlistReducer, {
    wishlistPersistMiddleware,
} from "../features/wishlist/wishlistSlice";
import themeReducer from "../features/theme/themeSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import uiReducer from "../features/ui/uiSlice";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        theme: themeReducer,
        notification: notificationReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(wishlistPersistMiddleware),
});

export { store };
