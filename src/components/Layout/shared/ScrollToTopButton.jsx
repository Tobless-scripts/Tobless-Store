import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const location = useLocation();

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Calculate how far user has scrolled (0-100)
            const percentScrolled =
                (scrollY / (documentHeight - windowHeight)) * 100;
            setScrollPercentage(percentScrolled);

            // Show button after user scrolls down 150px
            setIsVisible(scrollY > 150);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white rounded-full z-50 w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                isVisible ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            aria-label="Scroll to top"
        >
            <div className="relative w-full h-full">
                {/* Circular progress background */}
                <svg
                    className="w-full h-full absolute top-0 left-0 transform -rotate-90"
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * scrollPercentage) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Arrow icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </div>
        </button>
    );
};

export default ScrollToTopButton;
