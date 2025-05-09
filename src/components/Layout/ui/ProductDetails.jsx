import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { lazy } from "react";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Truck } from "lucide-react";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import {
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
    selectIsInWishlist,
    clearWishlist,
} from "../../../redux/features/wishlist/wishlistSlice";
import { selectUserId } from "../../../redux/features/auth/authSlice";
import { showNotification } from "../../../redux/features/notifications/notificationSlice";
import { AddToCartNotification } from "./notifications/AddToCartNotification";
import { AddToWishlistNotification } from "./notifications/AddToWishlistNotification";
import { RemovedFromWishlistNotification } from "./notifications/RemovedFromWishlist";
import { LoggedInNotification } from "./notifications/LoggedInNotification";
import Accordion from "./Accordion";
import RelatedProducts from "../shared/RelatedProducts";
import Footer from "../shared/Footer";

const Notification = lazy(() =>
    import("../../../redux/src/component/Notification")
);

const ProductDetails = () => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const wishListItems = useSelector(selectWishlistItems);
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product using Axios
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://dummyjson.com/products/${productId}`
                );
                setProduct(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

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

    // Validate and parse productId
    const parsedProductId = useMemo(() => {
        const id = parseInt(productId);
        return isNaN(id) ? null : id;
    }, [productId]);

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

            const isInWishlist = isProductInWishlist(product.id);

            if (isInWishlist) {
                dispatch(removeFromWishlist({ id: product.id, userId }));
                dispatch(
                    showNotification({
                        message: (
                            <RemovedFromWishlistNotification
                                product={product}
                            />
                        ),
                        type: "success",
                        duration: 5000,
                    })
                );
            } else {
                dispatch(addToWishlist({ item: product, userId }));
                dispatch(
                    showNotification({
                        message: (
                            <AddToWishlistNotification product={product} />
                        ),
                        type: "success",
                        duration: 5000,
                    })
                );
            }
        },
        [dispatch, isProductInWishlist, userId]
    );

    const handleAddToCart = useCallback(() => {
        if (!product) return;
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
    }, [dispatch, product, userId]);

    const directions = useMemo(
        () => [
            {
                label: "0",
                rotation: "rotate-0",
                style: "bg-transparent dark:bg-[#222934]",
            },
            {
                label: "90",
                rotation: "rotate-90",
                style: "bg-[#222934] dark:bg-white rounded",
            },
            {
                label: "180",
                rotation: "rotate-180",
                style: "bg-[#222934] dark:bg-white rounded",
            },
            {
                label: "360",
                rotation: "rotate-[360deg]",
                style: "bg-[#222934] dark:bg-white rounded",
            },
            {
                label: "-90",
                rotation: "rotate-[-90deg]",
                style: "bg-[#222934] dark:bg-white rounded",
            },
            {
                label: "-45",
                rotation: "rotate-[-180deg]",
                style: "bg-[#222934] dark:bg-white rounded",
            },
        ],
        []
    );

    if (!parsedProductId) {
        return (
            <div className="text-center py-12 text-red-500">
                Invalid product ID
            </div>
        );
    }

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
                Error loading product: {error.message}
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-12">Product not found</div>;
    }

    const rating = product.rating;

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-[#181d25] relative">
                <div className="relative grid grid-cols-1 lg:grid-cols-[65%_35%] gap-10 px-14 pt-12 pb-2">
                    <div className="flex overflow-x-auto gap-4 lg:grid lg:grid-cols-2 p-4 lg:p-0 scroll-smooth">
                        {directions.map((dir, i) => (
                            <div key={i} className="aspect-square">
                                <img
                                    src={product.thumbnail}
                                    alt={product.title || "Product image"}
                                    className={`min-w-52 lg:w-full h-full object-contain ${dir.rotation} ${dir.style} transition-transform duration-300`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-6 h-auto lg:mr-12 lg:sticky lg:max-h-fit top-28">
                        <p className="text-[#6C727F] text-xs font-normal">
                            {product.id || "V00273124"}
                        </p>
                        <p className="text-gray-900 dark:text-gray-200 text-lg">
                            {product.description || "No description available"}
                        </p>
                        <h1 className="font-bold text-gray-900 dark:text-gray-200 text-2xl">
                            ${product.price || "0.00"}
                        </h1>
                        <h2 className="text-[#4e5562] dark:text-gray-200">
                            <span className="font-semibold text-black dark:text-white">
                                {rating ? (
                                    <h2>
                                        <p>
                                            <span>Rating: </span>
                                            <span>
                                                {"★".repeat(Math.round(rating))}
                                                {"☆".repeat(
                                                    5 - Math.round(rating)
                                                )}
                                                ({rating.toFixed(1)}&nbsp;)
                                            </span>
                                        </p>
                                    </h2>
                                ) : (
                                    <span>No rating available</span>
                                )}
                            </span>
                        </h2>
                        <div className="flex justify-between gap-4 items-center">
                            <button
                                onClick={handleAddToCart}
                                className="mt-4 w-full bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm font-medium py-2.5 px-4 transition-all cursor-pointer"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={() => handleWishlistClick(product)}
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
                        <NavLink to="/shop" className="w-full">
                            <button className="w-full bg-[#2b3542] hover:bg-[#222934] dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full text-white dark:text-[#222934] text-sm font-medium py-2.5 px-4 transition-all cursor-pointer">
                                Continue shopping
                            </button>
                        </NavLink>
                        <div className="flex gap-2 items-center">
                            <Truck
                                size={20}
                                className="text-gray-800 dark:text-gray-200"
                            />
                            <p className="text-gray-800 dark:text-gray-200 text-sm">
                                Free shipping
                            </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-200 text-sm">
                            Get it between May 24 - May 27 to{" "}
                            <span className="font-bold">Preston - 06365</span>
                        </p>
                        <div className="bg-gray-200 dark:bg-[#222934] flex flex-wrap gap-4 items-center p-4 rounded">
                            <span>
                                <h2 className="mb-1 font-semibold text-gray-900 dark:text-gray-200 text-sm">
                                    Have a question?
                                </h2>
                                <p className="font-medium text-gray-600 dark:text-gray-200 text-sm">
                                    Contact us if you have questions
                                </p>
                            </span>
                            <span>
                                <button className="bg-gray-200 hover:bg-[#222934] dark:bg-[#222934] dark:hover:bg-gray-200 text-xs text-gray-900 hover:text-gray-200 dark:text-gray-200 dark:hover:text-gray-900 border rounded-full py-2 px-5 font-semibold transition-all cursor-pointer">
                                    Contact us
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <MoreDescription product={product} />
            {product.category && (
                <div>
                    <RelatedProducts
                        currentProductId={product.id}
                        category={product.category}
                    />
                </div>
            )}
            <Notification />
            <Footer />
        </>
    );
};

function MoreDescription({ product }) {
    if (!product) return null;

    const productItems = [
        {
            title: "Product Info",
            content: product.description || "No description available",
        },
        {
            title: "Warranty information",
            content:
                "We stand behind the quality of our products. Our product comes with a 10-year warranty, guaranteeing against defects in materials and workmanship under normal use. In the unlikely event that you encounter any issues with your product, contact our customer service team, and we will be happy to assist you with a replacement or repair.",
        },
        {
            title: "Delivery and shipping",
            content:
                "We understand the importance of timely delivery and strive to provide a seamless shipping experience for our customers. Upon placing your order, our team will process it promptly, and you will receive a notification once your product is ready for shipment. We offer various shipping options to accommodate your preferences, with estimated delivery times provided at checkout. Rest assured, your product will be carefully packaged to ensure it arrives safely at your doorstep, ready to enhance your home with its timeless charm. We provide fast shipping. Estimated delivery times are between 3 to 5 days after order confirmation.",
        },
    ];

    return (
        <div className="px-14 pt-12 pb-12 flex flex-col gap-6 lg:w-[65%]">
            <div>
                <p className="text-[#4e5562] dark:text-gray-200 font-normal text-md">
                    {product.description || "No description available"}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-[#4e5562] dark:text-gray-200">
                    <span className="font-semibold text-black dark:text-white">
                        Title:&nbsp;
                    </span>
                    {product.title || "No title available"}
                </h2>
                <h2 className="text-[#4e5562] dark:text-gray-200">
                    <span className="font-semibold text-black dark:text-white">
                        Category:&nbsp;
                    </span>
                    {product.category || "No category available"}
                </h2>
                <h2 className="text-[#4e5562] dark:text-gray-200">
                    <span className="font-semibold text-black dark:text-white">
                        Brand:&nbsp;
                    </span>
                    {product.brand || "No brand available"}
                </h2>
            </div>

            <Accordion items={productItems} />
        </div>
    );
}

export default ProductDetails;
