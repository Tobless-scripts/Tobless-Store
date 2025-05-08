import { useCallback, useEffect, useRef } from "react";
import { forwardRef } from "react";
import { X, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { addToCart } from "../../../../redux/features/cart/cartSlice";
import {
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectWishlistStatus,
} from "../../../../redux/features/wishlist/wishlistSlice";
import { selectUserId } from "../../../../redux/features/auth/authSlice";
import { showNotification } from "../../../../redux/features/notifications/notificationSlice";
import { AddToCartNotification } from "../notifications/AddToCartNotification";
import { AddToWishlistNotification } from "../notifications/AddToWishlistNotification";
import { RemovedFromWishlistNotification } from "../notifications/RemovedFromWishlist";
import { LoggedInNotification } from "../notifications/LoggedInNotification";
import { closeAllPanels } from "../../../../redux/features/ui/uiSlice";
import LoadingSpinner from "react";

const WishList = forwardRef((_, ref) => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistStatus = useSelector(selectWishlistStatus);
    const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);
    const contentRef = useRef(null);

    // Enhanced initialization with error handling
    useEffect(() => {
        if (userId) {
            const loadWishlist = async () => {
                try {
                    dispatch(initializeWishlist(userId));
                } catch (error) {
                    console.error("Failed to load wishlist", error);
                }
            };

            loadWishlist();
        }
    }, [dispatch, userId]);

    // Scroll management
    useEffect(() => {
        if (isWishlistOpen && contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [isWishlistOpen]);

    const isProductInWishlist = useCallback(
        (productId) => wishlistItems.some((item) => item.id === productId),
        [wishlistItems]
    );

    const closeWishlist = useCallback(() => {
        dispatch(closeAllPanels());
    }, [dispatch]);

    const handleWishlistClick = useCallback(
        (product) => {
            if (!userId) {
                dispatch(
                    showNotification({
                        message: <LoggedInNotification />,
                        type: "error",
                        duration: 3000,
                    })
                );
                return;
            }

            const action = isProductInWishlist(product.id)
                ? removeFromWishlist
                : addToWishlist;

            dispatch(
                action({
                    id: product.id,
                    item: product,
                    userId,
                })
            );

            dispatch(
                showNotification({
                    message: isProductInWishlist(product.id) ? (
                        <RemovedFromWishlistNotification product={product} />
                    ) : (
                        <AddToWishlistNotification product={product} />
                    ),
                    type: "success",
                    duration: 5000,
                })
            );
        },
        [dispatch, isProductInWishlist, userId]
    );

    const handleAddToCart = useCallback(
        (product) => {
            dispatch(
                addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.thumbnail,
                    quantity: 1,
                })
            );
            dispatch(
                showNotification({
                    message: <AddToCartNotification product={product} />,
                    type: "success",
                    duration: 5000,
                })
            );
        },
        [dispatch]
    );

    const handleAddToCartAndClose = useCallback(
        (item) => {
            handleAddToCart(item);
            closeWishlist();
        },
        [closeWishlist, handleAddToCart]
    );

    if (wishlistStatus === "loading") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`fixed inset-0 z-50 transition-all duration-300 ${
                isWishlistOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={closeWishlist}
            />

            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${
                    isWishlistOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Your Wishlist ({wishlistItems.length})
                        </h2>
                        <button
                            onClick={closeWishlist}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Close wishlist"
                        >
                            <X
                                size={20}
                                className="h-6 w-6 text-gray-800 dark:text-white cursor-pointer"
                            />
                        </button>
                    </div>

                    <div ref={contentRef} className="flex-grow overflow-y-auto">
                        {wishlistItems.length === 0 ? (
                            <EmptyWishlistView closeWishlist={closeWishlist} />
                        ) : (
                            <WishlistItemsView
                                items={wishlistItems}
                                isProductInWishlist={isProductInWishlist}
                                handleAddToCartAndClose={
                                    handleAddToCartAndClose
                                }
                                handleWishlistClick={handleWishlistClick}
                            />
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <NavLink
                            to="/shop"
                            onClick={closeWishlist}
                            className="w-full"
                        >
                            <button className="w-full rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 py-2 px-4 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                Continue Shopping
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Extracted sub-components for better readability
const EmptyWishlistView = ({ closeWishlist }) => (
    <div className="flex h-full gap-6 flex-col items-center justify-center">
        <Heart size={96} className="text-gray-800 dark:text-gray-200" />
        <p className="text-gray-900 dark:text-gray-200 text-lg font-semibold">
            Your wishlist is empty
        </p>
        <h2 className="mb-4 text-gray-600 dark:text-gray-400 text-sm text-center">
            Explore our wide range of products and add items to your cart to
            proceed with your purchase.
        </h2>
        <NavLink
            to="/shop"
            onClick={closeWishlist}
            className="rounded-full bg-primary px-6 py-2 text-gray-900 dark:text-white hover:bg-primary-dark"
        >
            Continue Shopping
        </NavLink>
    </div>
);

const WishlistItemsView = ({
    items,
    isProductInWishlist,
    handleAddToCartAndClose,
    handleWishlistClick,
}) => (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
            <li key={item.id} className="py-4">
                <div className="flex gap-4">
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                    />
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            ${item.price.toFixed(2)}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleAddToCartAndClose(item)}
                                className="bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm font-medium py-2 px-4 transition-all cursor-pointer"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={() => handleWishlistClick(item)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label={
                                    isProductInWishlist(item.id)
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                            >
                                <Heart
                                    size={18}
                                    className={
                                        isProductInWishlist(item.id)
                                            ? "text-[#222934] dark:text-white fill-[#222934] dark:fill-white cursor-pointer"
                                            : "text-gray-800 dark:text-white"
                                    }
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        ))}
    </ul>
);

WishList.displayName = "WishList";

export default WishList;
