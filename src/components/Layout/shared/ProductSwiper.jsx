import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const ProductSwiper = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const prevImageRef = useRef(null);
    const currentImageRef = useRef(null);
    const nextImageRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await axios.get(
                    "https://dummyjson.com/products/categories"
                );
                const categoryList = categoriesRes.data.slice(0, 24);
                const productPromises = categoryList.map((cat) =>
                    axios.get(
                        `https://dummyjson.com/products/category/${cat.slug}?limit=1`
                    )
                );
                const productData = await Promise.all(productPromises);
                setProducts(productData.map((res) => res.data.products[0]));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const offset = direction === "left" ? -100 : 100;

        const animate = (ref) => {
            if (ref.current) {
                gsap.fromTo(
                    ref.current,
                    { x: offset, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power3.out",
                    }
                );
            }
        };

        if (direction) {
            animate(prevImageRef);
            animate(currentImageRef);
            animate(nextImageRef);

            const timeout = setTimeout(() => setDirection(null), 600);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, direction, products.length]);

    const handlePrev = () => {
        if (direction) return;
        setDirection("left");
        setCurrentIndex((prev) =>
            prev === 0 ? products.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        if (direction) return;
        setDirection("right");
        setCurrentIndex((prev) =>
            prev === products.length - 1 ? 0 : prev + 1
        );
    };

    if (products.length === 0) return;

    const getAdjacentIndex = (offset) => {
        return (currentIndex + offset + products.length) % products.length;
    };

    const prevProduct = products[getAdjacentIndex(-1)];
    const nextProduct = products[getAdjacentIndex(1)];

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f5f7fa] dark:bg-transparent overflow-hidden p-4">
            <div className="text-center lg:px-56 xl:px-76">
                <h1 className="font-bold xl:mt-16 text-slate-900 dark:text-slate-200 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.196]">
                    Everything You Need for a Modern Life
                </h1>
            </div>
            <div className="relative w-full">
                {/* Carousel Track */}
                <div
                    ref={containerRef}
                    className="relative w-full overflow-hidden"
                >
                    <div
                        ref={trackRef}
                        className="flex items-center justify-between gap-4 w-full"
                    >
                        {/* Previous Preview */}
                        <div className="flex-shrink-0 w-1/4 hidden lg:flex max-w-[200px] bg-white dark:bg-gray-800 rounded-full transition-opacity">
                            <img
                                ref={prevImageRef}
                                src={prevProduct?.thumbnail}
                                alt={prevProduct?.title}
                                loading="lazy"
                                className="w-full h-auto aspect-square object-cover rounded-lg opacity-60 "
                            />
                        </div>

                        {/* Previous Arrow */}
                        <button
                            onClick={handlePrev}
                            className=" z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                        >
                            <ChevronLeft
                                size={32}
                                className="text-gray-700 dark:text-gray-200"
                            />
                        </button>

                        {/* Current Product */}
                        <div className="flex-shrink-0 w-1/2 bg-transparent rounded-full max-w-[350px] z-10">
                            <img
                                ref={currentImageRef}
                                src={products[currentIndex]?.thumbnail}
                                alt={products[currentIndex]?.title}
                                loading="lazy"
                                className="w-full aspect-square object-cover rounded-xl "
                            />
                        </div>

                        {/* Next Arrow */}
                        <button
                            onClick={handleNext}
                            className=" z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                        >
                            <ChevronRight
                                size={32}
                                className="text-gray-700 dark:text-gray-200"
                            />
                        </button>

                        {/* Next Preview */}
                        <div className="flex-shrink-0 hidden lg:flex w-1/4 max-w-[200px] bg-white dark:bg-gray-800 rounded-full transition-opacity">
                            <img
                                ref={nextImageRef}
                                src={nextProduct?.thumbnail}
                                alt={nextProduct?.title}
                                loading="lazy"
                                className="w-full h-auto aspect-square object-cover rounded-lg opacity-60 "
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-8 text-center max-w-2xl px-4">
                <h2 className="text-base leading-snug text-slate-700 dark:text-slate-200">
                    {products[currentIndex]?.title}
                </h2>
                <p className="text-xl md:text-2xl leading-8 text-gray-900 font-bold dark:text-gray-200 mt-2">
                    ${products[currentIndex]?.price}
                </p>
            </div>

            <div className="mt-8">
                <NavLink to="/categories">
                    <button className="bg-slate-900 dark:bg-slate-200 flex gap-2 justify-center items-center hover:bg-gray-200 mb-12 text-base text-gray-200 dark:text-gray-900 hover:border hover:border-2 hover:border-slate-900 hover:text-[#181d25] leading-4 font-medium py-3 px-6 border border-2 border-gray-200 rounded-full transition-all ease-in-out cursor-pointer">
                        Shop now <ArrowRight />
                    </button>
                </NavLink>
            </div>
        </div>
    );
};

export default ProductSwiper;
