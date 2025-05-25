import React, { useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { selectUserId } from "../../redux/features/auth/authSlice";
import { lazy } from "react";
import {
    selectWishlistItems,
    initializeWishlist,
    clearWishlist,
    selectIsInWishlist,
    removeFromWishlist,
    addToWishlist,
} from "../../redux/features/wishlist/wishlistSlice";
import { showNotification } from "../../redux/features/notifications/notificationSlice";
import { LoggedInNotification } from "../Layout/ui/notifications/LoggedInNotification";
import { RemovedFromWishlistNotification } from "../Layout/ui/notifications/RemovedFromWishlist";
import { AddToWishlistNotification } from "../Layout/ui/notifications/AddToWishlistNotification";
const Notification = lazy(() =>
    import("../../redux/src/component/Notification")
);

const ShopCatalog = ({ activeCategory, products = [], filterName }) => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);

    // Initialize wishlist when user changes
    useEffect(() => {
        if (userId) {
            dispatch(initializeWishlist(userId));
        } else {
            dispatch(clearWishlist());
        }
    }, [dispatch, userId]);

    // Memoized wishlist check for performance
    const isProductInWishlist = useCallback(
        (productId) =>
            selectIsInWishlist(productId)({
                wishlist: { items: wishListItems },
            }),
        [wishListItems]
    );

    // Handle wishlist toggle
    const handleWishlistClick = (product) => {
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

        const isInWishlist = isProductInWishlist(product.id);

        if (isInWishlist) {
            dispatch(removeFromWishlist({ id: product.id, userId }));
            dispatch(
                showNotification({
                    message: (
                        <RemovedFromWishlistNotification product={product} />
                    ),
                    type: "success",
                    duration: 5000,
                })
            );
        } else {
            dispatch(addToWishlist({ item: product, userId }));
            dispatch(
                showNotification({
                    message: <AddToWishlistNotification product={product} />,
                    type: "success",
                    duration: 5000,
                })
            );
        }
    };

    // Loading and error states (now handled by parent)
    if (!products) {
        return (
            <div className="flex justify-center items-center h-64">
                <ClipLoader color="#3B82F6" size={50} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex-1">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl text-gray-900 dark:text-gray-200 font-bold capitalize first-letter:uppercase">
                            {activeCategory
                                ? activeCategory.replace(/-/g, " ")
                                : "All Products"}
                        </h2>
                        {filterName && (
                            <p className="text-sm text-gray-500 mt-1">
                                Sorted by:{" "}
                                <span className="font-medium">
                                    {filterName}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {products.length}{" "}
                        {products.length === 1 ? "product" : "products"}
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            No products found in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="overflow-hidden">
                                <NavLink
                                    to={`/product/${product.id}`}
                                    className="w-full"
                                >
                                    <div className="h-60 cursor-pointer">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm leading-5 mb-2 line-clamp-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-800 dark:text-gray-100 text-base leading-6 font-semibold mb-2">
                                            ${product.price}
                                        </p>
                                        <div className="flex justify-between gap-4 items-center">
                                            <button className="mt-4 w-full bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm leading-5 font-medium py-2.5 px-4 rounded transition-all cursor-pointer ease-in-out">
                                                View Details
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleWishlistClick(product)
                                                }
                                                className="bg-white dark:bg-gray-600 p-2 rounded-full cursor-pointer"
                                                aria-label={
                                                    isProductInWishlist(
                                                        product.id
                                                    )
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                            >
                                                <Heart
                                                    className={
                                                        isProductInWishlist(
                                                            product.id
                                                        )
                                                            ? "text-[#222934] dark:text-white fill-[#222934] dark:fill-white"
                                                            : "text-gray-800 dark:text-white"
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Notification />
        </div>
    );
};

export default React.memo(ShopCatalog);
