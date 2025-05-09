import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoggedInNotification } from "./notifications/LoggedInNotification";
import { showNotification } from "../../../redux/features/notifications/notificationSlice";
import { RemovedFromWishlistNotification } from "./notifications/RemovedFromWishlist";
import { AddToWishlistNotification } from "./notifications/AddToWishlistNotification";
import {
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectIsInWishlist,
    clearWishlist,
} from "../../../redux/features/wishlist/wishlistSlice";
import { selectUserId } from "../../../redux/features/auth/authSlice";
import Footer from "../shared/Footer";

const Notification = lazy(() =>
    import("../../../redux/src/component/Notification")
);

const Shop = () => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products using Axios
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "https://dummyjson.com/products"
                );
                setProducts(response.data.products); // Access the products array
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Initialize or clear wishlist based on auth status
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ClipLoader color="#3B82F6" size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto text-center">
                Error loading products: {error.message}
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-[#181d25] px-4 lg:px-14 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="overflow-hidden">
                            <div className="h-60">
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
                                    <NavLink
                                        to={`/product/${product.id}`}
                                        className="w-full"
                                    >
                                        <button className="mt-4 w-full bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm leading-5 font-medium py-2.5 px-4 rounded transition-all cursor-pointer ease-in-out">
                                            View Details
                                        </button>
                                    </NavLink>
                                    <button
                                        onClick={() =>
                                            handleWishlistClick(product)
                                        }
                                        className="bg-white dark:bg-gray-600 p-2 rounded-full cursor-pointer"
                                        aria-label={
                                            isProductInWishlist(product.id)
                                                ? "Remove from wishlist"
                                                : "Add to wishlist"
                                        }
                                    >
                                        <Heart
                                            className={
                                                isProductInWishlist(product.id)
                                                    ? "text-[#222934] dark:text-white fill-[#222934] dark:fill-white"
                                                    : "text-gray-800 dark:text-white"
                                            }
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Notification />
            </div>
            <Footer />
        </>
    );
};

export default Shop;
