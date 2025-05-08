import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { NavLink } from "react-router-dom";

const ProductCarousel = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const animationRef = useRef(null);

    const fetchProductsFromCategories = useCallback(async () => {
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

            // Extract products from responses
            const productsFromCategories = productsResponses
                .map((response) => response.data.products[0])
                .filter(Boolean);

            setProducts(productsFromCategories);
        } catch (err) {
            console.error("Failed to load products:", err);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductsFromCategories();
    }, [fetchProductsFromCategories]);

    useEffect(() => {
        if (!products.length || !carouselRef.current) return;

        const setupCarousel = () => {
            const carousel = carouselRef.current;
            const items = carousel.children;
            if (items.length === 0) return;

            const itemWidth = items[0].getBoundingClientRect().width + 48;

            // Clear existing clones
            while (carousel.children.length > products.length) {
                carousel.removeChild(carousel.lastChild);
            }

            // Double the items for infinite effect
            for (let i = 0; i < products.length; i++) {
                const clone = items[i].cloneNode(true);
                carousel.appendChild(clone);
            }

            const totalWidth = itemWidth * products.length;
            carousel.style.width = `${totalWidth * 5}px`;

            // Kill existing animation before creating new one
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // GSAP animation
            animationRef.current = gsap.to(carousel, {
                x: -totalWidth,
                duration: 30,
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
                },
            });
        };

        setupCarousel();

        // Pause on hover
        const carousel = carouselRef.current;
        const pauseAnimation = () => animationRef.current?.pause();
        const resumeAnimation = () => animationRef.current?.play();

        carousel.addEventListener("mouseenter", pauseAnimation);
        carousel.addEventListener("mouseleave", resumeAnimation);

        return () => {
            animationRef.current?.kill();
            carousel?.removeEventListener("mouseenter", pauseAnimation);
            carousel?.removeEventListener("mouseleave", resumeAnimation);
        };
    }, [products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-pulse flex space-x-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full bg-gray-200 h-36 w-36"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
                <button
                    onClick={fetchProductsFromCategories}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-full px-4 lg:px-14 py-12 bg-white overflow-hidden relative">
            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex gap-12 py-4 px-4"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0"
                            role="group"
                            aria-label={`Product from ${product.category}`}
                        >
                            <div className="bg-gray-100 overflow-hidden rounded-full w-24 h-24 sm:w-36 sm:h-36 cursor-pointer gap-4 flex items-center justify-center">
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-1/2 h-1/2 object-cover rounded-full"
                                    loading="lazy"
                                />
                            </div>
                            <NavLink to="/categories">
                                <p className="text-xs font-medium text-gray-700 text-center cursor-pointer mt-2 capitalize">
                                    {product.category.replace(/-/g, " ")}
                                </p>
                            </NavLink>
                        </div>
                    ))}
                </div>
                {/* Gradient fade effect at edges */}
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default ProductCarousel;
