import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Cart from "../ui/shopping/cart";
import WishList from "../ui/shopping/wishlist";
import {
    toggleCart,
    toggleWishlist,
    toggleSearchPanel,
    closeAllPanels,
} from "../../../redux/features/ui/uiSlice";
import {
    selectIsCartOpen,
    selectIsWishlistOpen,
    selectIsSearchPanelOpen,
} from "../../../redux/features/ui/uiSelectors";

function Header() {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const navRef = useRef(null);
    const cartRef = useRef(null);
    const wishlistRef = useRef(null);
    const searchRef = useRef(null);

    // Get state from Redux
    const isCartOpen = useSelector(selectIsCartOpen);
    const isWishlistOpen = useSelector(selectIsWishlistOpen);
    const isSearchPanelOpen = useSelector(selectIsSearchPanelOpen);
    const cartItemCount = useSelector((state) => state.cart.items.length);
    const wishlistItemCount = useSelector(
        (state) => state.wishlist.items.length
    );

    // Toggle functions using Redux actions
    const toggleCartPanel = () => {
        dispatch(toggleCart());
        if (!isCartOpen && isWishlistOpen) {
            dispatch(closeAllPanels());
            dispatch(toggleCart());
        }
    };

    const toggleWishlistPanel = () => {
        dispatch(toggleWishlist());
        if (!isWishlistOpen && isCartOpen) {
            dispatch(closeAllPanels());
            dispatch(toggleWishlist());
        }
    };

    const handleSearchPanel = () => {
        dispatch(toggleSearchPanel());
        if (!isSearchPanelOpen && (isCartOpen || isWishlistOpen)) {
            dispatch(closeAllPanels());
            dispatch(toggleSearchPanel());
        }
    };

    // Close panels when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                const isCartIcon = event.target.closest(".shopping-cart-icon");
                if (!isCartIcon && isCartOpen) {
                    dispatch(closeAllPanels());
                }
            }

            if (
                wishlistRef.current &&
                !wishlistRef.current.contains(event.target)
            ) {
                const isWishlistIcon = event.target.closest(".wishlist-icon");
                if (!isWishlistIcon && isWishlistOpen) {
                    dispatch(closeAllPanels());
                }
            }

            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                const isSearchIcon = event.target.closest(".search-icon");
                if (!isSearchIcon && isSearchPanelOpen) {
                    dispatch(closeAllPanels());
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch, isCartOpen, isWishlistOpen, isSearchPanelOpen]);

    // Body overflow management
    useEffect(() => {
        document.body.style.overflow =
            isOpen || isCartOpen || isWishlistOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen, isCartOpen, isWishlistOpen]);

    // Fixed Navbar on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSearchSuggestions([]);
            return;
        }
        try {
            const response = await fetch(
                `https://dummyjson.com/products/search?q=${query}`
            );
            const data = await response.json();
            setSearchSuggestions(data.products || []);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 1) {
            fetchSuggestions(searchQuery);
        } else {
            setSearchSuggestions([]);
        }
    }, [searchQuery]);

    const NavBarLinks = [
        { id: 1, name: "Home", linkTo: "/" },
        { id: 2, name: "Shop", linkTo: "/shop" },
        { id: 3, name: "Categories", linkTo: "/categories" },
    ];

    const getNavLinkClass = ({ isActive }) =>
        `text-sm leading-[1] transition-all duration-300 w-max ease-in-out font-medium group relative inline-block overflow-hidden py-1 transition-colors ${
            isActive
                ? "border-b border-gray-800 dark:border-white text-gray-800 dark:text-white"
                : "text-gray-900 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white rounded"
        }`;

    return (
        <>
            <header className="sticky top-0 z-50">
                <div
                    className={`bg-white rounded-full py-3 px-4 lg:px-14 shadow-md dark:shadow-lg shadow-gray-500 dark:shadow-gray-700 flex justify-between items-center transition-all duration-300 ease-in-out 
                    ${
                        isScrolled
                            ? "w-full mx-0 my-0 rounded-none"
                            : "w-full md:w-[90%] mx-auto my-10"
                    }`}
                >
                    {/* Mobile Menu Button */}
                    <button
                        className="flex md:hidden items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                    </button>

                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="flex-shrink-0 transition-all duration-300 ease-in-out"
                    >
                        <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl font-semibold">
                            ToblessMart
                        </h1>
                    </NavLink>

                    {/* Desktop Navbar */}
                    <nav className="hidden md:flex items-center transition-all duration-300 ease-in-out gap-4 md:gap-6">
                        {NavBarLinks.map((link) => (
                            <NavLink
                                key={link.id}
                                to={link.linkTo}
                                className={getNavLinkClass}
                            >
                                <span className="relative z-10">
                                    {" "}
                                    {link.name}{" "}
                                </span>
                                <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-400 dark:bg-gray-200 transition-all duration-300 group-hover:w-full"></span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
                        {/* Search Icon */}
                        <div className="relative search-icon">
                            <Search
                                size={20}
                                className={`text-gray-800 dark:text-gray-200 cursor-pointer ${
                                    isSearchPanelOpen
                                        ? "text-primary-500 dark:text-primary-400"
                                        : ""
                                }`}
                                onClick={handleSearchPanel}
                            />
                        </div>

                        {/* Cart Icon */}
                        <div className="relative shopping-cart-icon">
                            <ShoppingCart
                                size={20}
                                className="text-gray-800 dark:text-gray-200 cursor-pointer"
                                onClick={toggleCartPanel}
                            />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>

                        {/* Wishlist Icon */}
                        <div className="relative wishlist-icon">
                            <Heart
                                size={20}
                                className="text-gray-800 dark:text-gray-200 cursor-pointer"
                                onClick={toggleWishlistPanel}
                            />
                            {wishlistItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </div>

                        {/* User Icon */}
                        <NavLink to="/account">
                            <button aria-label="Account">
                                <User
                                    size={20}
                                    className="text-gray-800 dark:text-gray-200 cursor-pointer"
                                />
                            </button>
                        </NavLink>
                    </div>
                </div>

                {/* Search Panel */}
                {isSearchPanelOpen && (
                    <div
                        ref={searchRef}
                        className={`w-full z-40 ${
                            isScrolled
                                ? "sticky shadow-lg bg-white top-[82px]"
                                : "static bg-white top-full"
                        } `}
                    >
                        <div className="flex mx-auto px-4 py-3 justify-between items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, categories, brands..."
                                className="w-full px-4 py-2 bg-white border text-gray-800 dark:text-gray-200 mx-auto border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-none lg:w-full md:w-full sm:w-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {searchSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full md:w-1/2 mt-1 bg-white text-black border-none rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchSuggestions.map((product) => (
                                    <li
                                        key={product.id}
                                        className="px-4 py-2 hover:bg-blue-50 text-black cursor-pointer"
                                    >
                                        {product.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    isOpen
                        ? "opacity-100 bg-black bg-opacity-50"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
            >
                <div
                    ref={navRef}
                    className={`absolute left-0 top-0 w-3/4 h-full bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col h-full p-6">
                        <div className="flex justify-between items-center mb-8">
                            <NavLink to="/" onClick={() => setIsOpen(false)}>
                                <h1 className="text-gray-800 dark:text-white text-2xl font-semibold">
                                    ToblessMart
                                </h1>
                            </NavLink>

                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close menu"
                                className="cursor-pointer"
                            >
                                <X className="w-6 h-6 text-gray-800 dark:text-white" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4 flex-grow">
                            {NavBarLinks.map((link) => (
                                <NavLink
                                    key={link.id}
                                    to={link.linkTo}
                                    onClick={() => setIsOpen(false)}
                                    className={getNavLinkClass}
                                >
                                    <span className="relative z-10">
                                        {link.name}
                                    </span>
                                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-400 dark:bg-gray-200 transition-all duration-300 group-hover:w-full"></span>
                                </NavLink>
                            ))}
                        </nav>

                        <div className="flex justify-center items-center gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                </div>
            </div>

            {/* Cart Component */}
            <Cart ref={cartRef} />

            {/* Wishlist Component */}
            <WishList ref={wishlistRef} />
        </>
    );
}

export default Header;
