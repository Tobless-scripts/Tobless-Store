import React, { useState, useEffect, useRef, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function HomeProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRefs = useRef([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products (you might want to paginate or fetch by category in a real app)
                const response = await fetch(
                    "https://dummyjson.com/products?limit=0"
                );
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

    // Organize products into different sections
    const sections = [
        {
            title: "Flash Sales",
            products: products.slice(0, 10),
            bgColor: "bg-red-50",
            timer: true,
        },
        {
            title: "Sponsored Products",
            products: products.slice(10, 20),
            bgColor: "bg-blue-50",
        },
        {
            title: "Top Sellers",
            products: products.filter((p) => p.rating > 4.5).slice(0, 10),
            bgColor: "bg-green-50",
        },
        {
            title: "Top Selling Items",
            products: products.sort((a, b) => b.stock - a.stock).slice(0, 10),
            bgColor: "bg-purple-50",
        },
        {
            title: "Limited Stock Deals",
            products: products.filter((p) => p.stock < 10).slice(0, 10),
            bgColor: "bg-yellow-50",
        },
        {
            title: "Appliances Bonanza",
            products: products
                .filter((p) => p.category === "home-decoration")
                .slice(0, 10),
            bgColor: "bg-indigo-50",
        },
        {
            title: "Fashion Forward",
            products: products
                .filter(
                    (p) =>
                        p.category === "womens-dresses" ||
                        p.category === "mens-shirts"
                )
                .slice(0, 10),
            bgColor: "bg-pink-50",
        },
        {
            title: "Upgrade Your Smartphone",
            products: products
                .filter((p) => p.category === "smartphones")
                .slice(0, 10),
            bgColor: "bg-gray-50",
        },
        {
            title: "Everything Must Go",
            products: products.sort((a, b) => a.price - b.price).slice(0, 10),
            bgColor: "bg-orange-50",
        },
        {
            title: "Fashion Top Deals",
            products: products
                .filter(
                    (p) =>
                        p.category === "womens-dresses" ||
                        p.category === "mens-shirts"
                )
                .sort((a, b) => a.price - b.price)
                .slice(0, 10),
            bgColor: "bg-teal-50",
        },
        {
            title: "Upgrade Your Home Today",
            products: products
                .filter(
                    (p) =>
                        p.category === "furniture" ||
                        p.category === "home-decoration"
                )
                .slice(0, 10),
            bgColor: "bg-amber-50",
        },
        {
            title: "Special Offers",
            products: products
                .sort((a, b) => b.discountPercentage - a.discountPercentage)
                .slice(0, 10),
            bgColor: "bg-rose-50",
        },
    ];

    return (
        <>
            <main className="w-full px-10 lg:px-14 py-6">
                {sections.map((section, index) => (
                    <ProductSection
                        key={section.title}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        title={section.title}
                        products={section.products}
                        bgColor={section.bgColor}
                        timer={section.timer}
                    />
                ))}
            </main>
            <Notification />
        </>
    );
}

const ProductSection = React.forwardRef(
    ({ title, products, bgColor, timer }, ref) => {
        const sliderRef = useRef(null);

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

            // Check if screen width is greater than lg (1024px)
            const isLargeScreen = window.innerWidth > 1024;
            const scrollAmount = isLargeScreen ? 288 : 200;

            slider.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        };

        return (
            <section
                ref={ref}
                className={`${bgColor} rounded-xl p-6 mb-8 shadow-sm`}
            >
                <div className="flex justify-end space-x-2 mb-2">
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

                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    {timer && (
                        <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-md">
                            <span className="font-medium">Ends in:</span>
                            <span className="font-mono">
                                <CountdownTimer />
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className="flex overflow-x-auto pb-4 mx-1 scroll-smooth no-scrollbar scrollbar-hide"
                    ref={sliderRef}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        );
    }
);

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 105,
        minutes: 59,
        seconds: 59,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                // Convert everything to seconds
                let totalSeconds =
                    prevTime.hours * 3600 +
                    prevTime.minutes * 60 +
                    prevTime.seconds;
                totalSeconds--;

                if (totalSeconds < 0) {
                    clearInterval(timer);
                    return { hours: 0, minutes: 0, seconds: 0 };
                }

                // Convert back to hours, minutes, seconds
                const hours = Math.floor(totalSeconds / 3600);
                const remainingSeconds = totalSeconds % 3600;
                const minutes = Math.floor(remainingSeconds / 60);
                const seconds = remainingSeconds % 60;

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => time.toString().padStart(2, "0");

    return (
        <span className="font-mono">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
            {formatTime(timeLeft.seconds)}
        </span>
    );
}

const ProductCard = ({ product }) => {
    const cardRef = useRef(null);

    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);

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

    return (
        <div
            ref={cardRef}
            className="product-card flex-shrink-0 w-50 xl:w-72 bg-white rounded-lg shadow-md mx-1 overflow-hidden transition-all duration-300"
        >
            <div className="relative h-22 md:h-32 lg:h-42 xl:h-52 py-2 overflow-hidden">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-fit object-contain duration-300"
                />
                {product.discountPercentage > 10 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(product.discountPercentage)}% OFF
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                    {product.title}
                </h3>
                <div className="flex items-center mt-1">
                    <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                    </span>
                    {product.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                            $
                            {(
                                product.price /
                                (1 - product.discountPercentage / 100)
                            ).toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                        ({product.rating})
                    </span>
                </div>
                <div className="flex justify-between gap-4 items-center">
                    <NavLink to={`/product/${product.id}`} className="w-full">
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
    );
};

export default HomeProduct;
