import React, { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../../redux/features/notifications/notificationSlice";
import { RemovedFromWishlistNotification } from "../ui/notifications/RemovedFromWishlist";
import { AddToWishlistNotification } from "../ui/notifications/AddToWishlistNotification";
import { lazy } from "react";
import gsap from "gsap";
import {
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectIsInWishlist,
    clearWishlist,
} from "../../../redux/features/wishlist/wishlistSlice";
import { selectUserId } from "../../../redux/features/auth/authSlice";
import { LoggedInNotification } from "../ui/notifications/LoggedInNotification";

const Notification = lazy(() =>
    import("../../../redux/src/component/Notification")
);

const RelatedProducts = ({ currentProductId, category }) => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);
    const sliderRef = useRef(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch related products using Axios
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://dummyjson.com/products/category/${category}`
                );

                // Filter out the current product and limit to 4 items
                const filteredProducts = response.data.products
                    .filter((product) => product.id !== currentProductId)
                    .slice(0, 4);

                setRelated(filteredProducts);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelatedProducts();
        }
    }, [category, currentProductId]);

    // Initialize or clear wishlist based on auth status
    useEffect(() => {
        if (userId) {
            dispatch(initializeWishlist(userId));
        } else {
            dispatch(clearWishlist());
        }
    }, [dispatch, userId]);

    const isProductInWishlist = useCallback(
        (productId) =>
            selectIsInWishlist(productId)({
                wishlist: { items: wishListItems },
            }),
        [wishListItems]
    );

    useEffect(() => {
        if (related.length > 0 && sliderRef.current) {
            gsap.fromTo(
                sliderRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, [related]);

    const scroll = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const scrollAmount = 260;
        slider.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

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
            <div className="text-center py-8">Loading related products...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Error loading related products
            </div>
        );
    }

    if (related.length === 0) {
        return (
            <div className="text-center py-8">No related products found.</div>
        );
    }

    return (
        <div className="px-4 lg:px-14 pb-12">
            <h2 className="mb-6 text-2xl font-semibold leading-9 text-slate-900 dark:text-white">
                Related Products
            </h2>
            <div className="flex xl:hidden justify-end space-x-2 mb-2">
                <button
                    onClick={() => scroll("left")}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                    aria-label="Scroll left"
                >
                    <ArrowLeft size={20} />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                    aria-label="Scroll right"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
            <div
                ref={sliderRef}
                className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4 py-4 md:p-0 scroll-smooth snap-x snap-mandatory"
            >
                {related.map((product) => (
                    <div
                        key={product.id}
                        className="max-sm:min-w-92 sm:min-w-78 xl:min-w-74 snap-start flex-shrink-0 rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="h-60">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-contain"
                                loading="lazy"
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
                                    <button className="mt-4 w-full bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm leading-5 font-medium py-2.5 px-4 transition-all cursor-pointer ease-in-out">
                                        View Details
                                    </button>
                                </NavLink>
                                <button
                                    onClick={() => handleWishlistClick(product)}
                                    className="bg-white dark:bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    aria-label={
                                        isProductInWishlist(product.id)
                                            ? "Remove from wishlist"
                                            : "Add to wishlist"
                                    }
                                >
                                    <Heart
                                        size={20}
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
    );
};

export default RelatedProducts;
