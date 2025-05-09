import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Cart from "../ui/shopping/cart";
import WishList from "../ui/shopping/wishlist";
import {
    toggleCart,
    toggleWishlist,
    closeAllPanels,
} from "../../../redux/features/ui/uiSlice";
import {
    selectIsCartOpen,
    selectIsWishlistOpen,
    selectIsSearchPanelOpen,
} from "../../../redux/features/ui/uiSelectors";
import { useCategory } from "../../context/categoryContext";

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { menuItems } = useCategory();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const navRef = useRef(null);
    const cartRef = useRef(null);
    const wishlistRef = useRef(null);
    const searchRef = useRef(null);

    // Handle Search Selection
    const handleSearchSelection = (category) => {
        // Navigate directly to the category with the product's category
        navigate(`/categories?category=${category}`);
        setSearchQuery("");
        setSearchSuggestions([]);

        // Optional: Scroll to top after navigation
        window.scrollTo(0, 0);
    };

    // Get state from Redux
    const isCartOpen = useSelector(selectIsCartOpen);
    const isWishlistOpen = useSelector(selectIsWishlistOpen);
    const isSearchPanelOpen = useSelector(selectIsSearchPanelOpen);
    const cartItemCount = useSelector((state) => state.cart.items.length);
    const wishlistItemCount = useSelector(
        (state) => state.wishlist.items.length
    );

    // Toggle functions using Redux actions
    const toggleCartPanel = useCallback(() => {
        dispatch(toggleCart());
        if (!isCartOpen && isWishlistOpen) {
            dispatch(closeAllPanels());
            dispatch(toggleCart());
        }
    }, [dispatch, isCartOpen, isWishlistOpen]);

    const toggleWishlistPanel = useCallback(() => {
        dispatch(toggleWishlist());
        if (!isWishlistOpen && isCartOpen) {
            dispatch(closeAllPanels());
            dispatch(toggleWishlist());
        }
    }, [dispatch, isWishlistOpen, isCartOpen]);

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
                    setSearchQuery("");
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
                    className={`bg-white rounded-lg py-3 px-4 lg:px-14 flex justify-between items-center transition-all duration-300 ease-in-out ${
                        isScrolled
                            ? "w-full mx-0 my-0 shadow-md"
                            : "w-full md:w-full mx-auto"
                    }`}
                >
                    {/* Mobile Menu Button */}
                    <button
                        className="flex md:hidden items-center gap-4 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                    </button>

                    {/* Logo */}
                    <NavLink to="/" className="flex-shrink-0">
                        <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl font-semibold">
                            ToblessMart
                        </h1>
                    </NavLink>

                    {/* Desktop Search (hidden on mobile) */}
                    <div className="hidden md:block relative flex-1 max-w-xl mx-4">
                        <div className="relative flex justify-evenly items-center w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, categories, brands..."
                                className="w-full pl-10 pr-4 py-2 bg-white border text-gray-800 dark:text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-none"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Desktop search suggestions */}
                        {searchSuggestions.length > 0 ? (
                            <ul
                                role="listbox"
                                className="absolute z-10 w-full mt-1 bg-white text-black border-none rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                                {searchSuggestions.map((product) => {
                                    const categoryItem = menuItems.find(
                                        (item) =>
                                            item.category
                                                ?.toLowerCase()
                                                .trim() ===
                                            product.category
                                                ?.toLowerCase()
                                                .trim()
                                    );

                                    if (!categoryItem) {
                                        return (
                                            <li
                                                key={product.id}
                                                role="option"
                                                className="px-4 py-2 text-gray-500 italic"
                                            >
                                                {product.title} - Category not
                                                available
                                            </li>
                                        );
                                    }

                                    return (
                                        <li
                                            key={product.id}
                                            role="option"
                                            className="px-4 py-2 hover:bg-gray-50 text-black cursor-pointer"
                                            onClick={() =>
                                                handleSearchSelection(
                                                    product.category
                                                )
                                            }
                                        >
                                            {product.title}
                                            <span className="block text-xs text-gray-500 mt-1">
                                                {categoryItem.name}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            searchQuery.length > 1 && (
                                <div className="absolute z-10 w-full mt-1 bg-white text-gray-500 border-none rounded-lg shadow-lg p-4">
                                    No matching products or categories found for
                                    "{searchQuery}"
                                </div>
                            )
                        )}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        {/* Icons */}
                        <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
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
                </div>

                {/* Mobile Search (sticky below header) */}
                <div className="md:hidden sticky top-[68px] z-40 bg-white py-2 border-t border-gray-200">
                    <div className="relative flex justify-evenly items-center w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, categories, brands..."
                            className="w-full pl-10 pr-4 py-2 bg-white border text-gray-800 dark:text-gray-200 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-none"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Mobile search suggestions */}
                    {searchSuggestions.length > 0 ? (
                        <ul
                            role="listbox"
                            className="absolute z-10 w-full mt-1 bg-white text-black border-none rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                            {searchSuggestions.map((product) => {
                                const categoryItem = menuItems.find(
                                    (item) =>
                                        item.category?.toLowerCase().trim() ===
                                        product.category?.toLowerCase().trim()
                                );

                                if (!categoryItem) {
                                    return (
                                        <li
                                            key={product.id}
                                            role="option"
                                            className="px-4 py-2 text-gray-500 italic"
                                        >
                                            {product.title} - Category not
                                            available
                                        </li>
                                    );
                                }

                                return (
                                    <li
                                        key={product.id}
                                        role="option"
                                        className="px-4 py-2 hover:bg-gray-50 text-black cursor-pointer"
                                        onClick={() =>
                                            handleSearchSelection(
                                                product.category
                                            )
                                        }
                                    >
                                        {product.title}
                                        <span className="block text-xs text-gray-500 mt-1">
                                            {categoryItem.name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        searchQuery.length > 1 && (
                            <div className="absolute z-10 w-full mt-1 bg-white text-gray-500 border-none rounded-lg shadow-lg p-4">
                                No matching products or categories found for "
                                {searchQuery}"
                            </div>
                        )
                    )}
                </div>
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
