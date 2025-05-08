import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { gsap } from "gsap";
import { ClipLoader } from "react-spinners";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoggedInNotification } from "../ui/notifications/LoggedInNotification";
import { showNotification } from "../../../redux/features/notifications/notificationSlice";
import { RemovedFromWishlistNotification } from "../ui/notifications/RemovedFromWishlist";
import Notification from "../../../redux/src/component/Notification";
import { AddToWishlistNotification } from "../ui/notifications/AddToWishlistNotification";
import {
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectIsInWishlist,
} from "../../../redux/features/wishlist/wishlistSlice";
import { selectUserId } from "../../../redux/features/auth/authSlice";

const PopularSlider = () => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);

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

    const fetchProductsFromCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all categories
            const categoriesRes = await axios.get(
                "https://dummyjson.com/products/categories"
            );
            const categories = categoriesRes.data;

            // For each category, fetch one product
            const productsPromises = categories.map((category) =>
                axios.get(
                    `https://dummyjson.com/products/category/${category.slug}?limit=1`
                )
            );

            const productsResponses = await Promise.all(productsPromises);
            console.log(categories);

            // Extract products from responses
            const productsFromCategories = productsResponses
                .map((response) => response.data.products[0])
                .filter(Boolean); // Filter out any undefined products

            setProducts(productsFromCategories);
        } catch (err) {
            console.error("Failed to load products:", err);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsFromCategories();
    }, []);

    useEffect(() => {
        if (products.length > 0 && sliderRef.current) {
            gsap.fromTo(
                sliderRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, [products]);

    const scroll = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const scrollAmount = 280;
        slider.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
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

    if (products.length === 0)
        return <div className="px-4 py-6">No products found</div>;

    return (
        <>
            <div className="relative px-4 lg:px-14 py-6">
                <h2 className="text-2xl text-slate-900 dark:text-slate-200 font-semibold mb-4">
                    Popular Products
                </h2>

                <div className="flex justify-end space-x-2 mb-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-6 no-scrollbar scroll-smooth pb-4"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="overflow-hidden flex flex-col max-sm:min-w-70 sm:min-w-72"
                        >
                            <div className="h-60 min-w-46">
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
            </div>
            <Notification />
        </>
    );
};

export default PopularSlider;
