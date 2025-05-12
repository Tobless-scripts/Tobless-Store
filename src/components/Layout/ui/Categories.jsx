import { useState, useEffect, useRef } from "react";
import ShopCatalog from "../../categories/ShopCatalog";
import { useCallback } from "react";
import CustomSelect from "../shared/CustomSelect";
import { ClipLoader } from "react-spinners";
import ProductSearch from "../../categories/SearchCategory";
import Footer from "../shared/Footer";
import { useCategory } from "../../context/categoryContext";
import { useNavigate, useLocation } from "react-router-dom";
const useChainMenu = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const indicatorRef = useRef(null);
    const progressRef = useRef(null);
    const menuItemRefs = useRef([]);
    const menuRef = useRef(null);

    const updatePositions = useCallback(() => {
        if (!menuRef.current || !indicatorRef.current || !progressRef.current)
            return;

        const activeItem = menuItemRefs.current[activeIndex];
        if (!activeItem) return;

        const firstItem = menuItemRefs.current[0];
        const lineStartY = firstItem.offsetTop + firstItem.offsetHeight / 2;
        const itemCenterY = activeItem.offsetTop + activeItem.offsetHeight / 1;
        const progressHeight = itemCenterY - lineStartY;

        indicatorRef.current.style.transform = `translateY(${progressHeight}px)`;
        progressRef.current.style.height = `${progressHeight}px`;
    }, [activeIndex]);

    useEffect(() => {
        updatePositions();
        window.addEventListener("resize", updatePositions);
        return () => window.removeEventListener("resize", updatePositions);
    }, [updatePositions]);

    return {
        activeIndex,
        setActiveIndex,
        selectedCategory,
        setSelectedCategory,
        indicatorRef,
        progressRef,
        menuItemRefs,
        menuRef,
        updatePositions,
    };
};

const Categories = () => {
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const navigate = useNavigate();
    const { menuItems } = useCategory();

    const filterItems = [
        { id: "best-match", name: "Best Match" },
        { id: "most-popular", name: "Most Popular" },
        { id: "newest", name: "Newest Arrivals" },
        { id: "price-low-high", name: "Price: Low to High" },
        { id: "price-high-low", name: "Price: High to Low" },
        { id: "highest-rating", name: "Highest Rating" },
    ];

    const [activeFilter, setActiveFilter] = useState(filterItems[0]);

    const {
        activeIndex,
        setActiveIndex,
        selectedCategory,
        setSelectedCategory,
        indicatorRef,
        progressRef,
        menuItemRefs,
        menuRef,
    } = useChainMenu();

    // Fetch all products on first render
    const fetchAllProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://dummyjson.com/products?limit=100"
            );
            const data = await response.json();
            setAllProducts(data.products || []);
        } catch (error) {
            console.error("Error fetching all products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch products based on category
    const fetchProductsByCategory = useCallback(async (category = "") => {
        setLoading(true);
        try {
            let products = [];
            if (category) {
                const response = await fetch(
                    `https://dummyjson.com/products/category/${category}`
                );
                const data = await response.json();
                products = data.products || [];
            } else {
                const response = await fetch(
                    "https://dummyjson.com/products?limit=100"
                );
                const data = await response.json();
                products = data.products || [];
            }
            setCategoryProducts(products);
            return products; // Return the fetched products
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Sort function
    const sortProducts = (products, filter, searchQuery = "") => {
        const sorted = [...products];
        const query = searchQuery.trim().toLowerCase();

        switch (filter.id) {
            case "best-match":
                if (query) {
                    sorted.sort((a, b) => {
                        const aTitle = a.title.toLowerCase();
                        const bTitle = b.title.toLowerCase();
                        const aExactMatch = aTitle.includes(query);
                        const bExactMatch = bTitle.includes(query);

                        if (aExactMatch && !bExactMatch) return -1; // a first
                        if (!aExactMatch && bExactMatch) return 1; // b first
                        return b.rating - a.rating;
                    });
                }
                break;

            case "most-popular":
            case "highest-rating":
                sorted.sort((a, b) => b.rating - a.rating);
                break;

            case "newest":
                sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
                break;

            case "price-low-high":
                sorted.sort((a, b) => a.price - b.price);
                break;

            case "price-high-low":
                sorted.sort((a, b) => b.price - a.price);
                break;

            default:
                break;
        }
        return sorted;
    };

    // Apply filter when activeFilter changes (user selects new filter)
    const applyFilter = useCallback(
        (filterType) => {
            if (!filterType) return;
            setActiveFilter(filterType);
            const productsToFilter = searchActive
                ? displayedProducts
                : categoryProducts;
            setDisplayedProducts(sortProducts(productsToFilter, filterType));
        },
        [categoryProducts, displayedProducts, searchActive]
    );

    // Initial data fetch
    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Handle category changes from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get("category");

        const loadCategory = async () => {
            setSearchActive(false);
            if (categoryParam) {
                const categoryIndex = menuItems.findIndex(
                    (item) => item.category === categoryParam
                );
                if (categoryIndex !== -1) {
                    setActiveIndex(categoryIndex);
                    setSelectedCategory(categoryParam);
                    const products = await fetchProductsByCategory(
                        categoryParam
                    );
                    setDisplayedProducts(sortProducts(products, activeFilter));
                }
            } else {
                setActiveIndex(0);
                setSelectedCategory("");
                const products = await fetchProductsByCategory("");
                setDisplayedProducts(sortProducts(products, activeFilter));
            }
        };

        loadCategory();
    }, [location.search, menuItems, activeFilter, fetchProductsByCategory]);

    const handleMenuItemClick = (category) => {
        navigate(category ? `/categories?category=${category}` : "/categories");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchResults = (searchTerm, foundProducts) => {
        if (!searchTerm.trim()) {
            setDisplayedProducts(sortProducts(categoryProducts, activeFilter));
            setSearchActive(false);
            return;
        }

        setSearchActive(true);
        setDisplayedProducts(foundProducts);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        if (foundProducts.length > 0 && searchTerm.trim()) {
            const firstMatchCategory = foundProducts[0].category;
            const categoryIndex = menuItems.findIndex(
                (item) => item.category === firstMatchCategory
            );
            if (categoryIndex !== -1 && categoryIndex !== activeIndex) {
                setActiveIndex(categoryIndex);
                setSelectedCategory(firstMatchCategory);
            }
        }
    };

    return (
        <>
            <div className="flex flex-col my-12 px-2 lg:px-14 lg:flex-row gap-6">
                {/* Left Sidebar - Sticky */}
                <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
                    <div className="py-4 space-y-4">
                        {/* Search Component */}
                        <div className="lg:hidden mb-4">
                            <ProductSearch
                                products={allProducts}
                                onSearch={handleSearchResults}
                                menuItems={menuItems}
                                setActiveIndex={setActiveIndex}
                                setSelectedCategory={setSelectedCategory}
                            />
                        </div>

                        {/* Mobile Category Selector */}
                        <div className="lg:hidden">
                            <CustomSelect
                                options={menuItems}
                                value={menuItems[activeIndex]}
                                onChange={(selected) => {
                                    const index = menuItems.findIndex(
                                        (item) => item.name === selected.name
                                    );
                                    handleMenuItemClick(
                                        index,
                                        selected.category
                                    );
                                }}
                                placeholder="Select a category"
                            />
                        </div>

                        {/* Filter Selector */}
                        <CustomSelect
                            key="filter-select"
                            options={filterItems}
                            value={activeFilter}
                            onChange={applyFilter}
                            placeholder="Filter by"
                        />

                        {/* Desktop Category Menu */}
                        <div
                            ref={menuRef}
                            className="hidden lg:block relative w-64"
                        >
                            {/* Track Line and Indicator */}
                            <div className="absolute left-1 top-0 h-full w-2 border border-indigo-300 rounded-full overflow-hidden bg-gray-300">
                                <div
                                    ref={progressRef}
                                    className="absolute top-0 left-0 w-full bg-indigo-300 transition-all duration-300 ease-out"
                                    style={{ height: "0" }}
                                />
                            </div>
                            <div
                                ref={indicatorRef}
                                className="absolute left-0 top-0 w-4 h-4 bg-indigo-600 rounded-full shadow-md transition-all duration-300 ease-out z-10 flex items-center justify-center border-2 border-white"
                                aria-hidden="true"
                            >
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>

                            {/* Menu Items */}
                            <nav aria-label="Category navigation">
                                <ul className="flex flex-col gap-1 w-full pl-4">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <button
                                                ref={(el) =>
                                                    (menuItemRefs.current[
                                                        index
                                                    ] = el)
                                                }
                                                className={`py-2 px-4 rounded-lg cursor-pointer text-xs transition-all duration-200 w-full text-left ${
                                                    activeIndex === index
                                                        ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                                                        : "hover:text-md text-gray-700 dark:text-indigo-200"
                                                }`}
                                                onClick={() =>
                                                    handleMenuItemClick(
                                                        index,
                                                        item.category
                                                    )
                                                }
                                                aria-current={
                                                    activeIndex === index
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Search Component  */}
                    <div className="hidden lg:block mb-6">
                        <ProductSearch
                            products={allProducts}
                            onSearch={handleSearchResults}
                            menuItems={menuItems}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <ClipLoader color="#3B82F6" size={50} />
                        </div>
                    ) : (
                        <ShopCatalog
                            activeCategory={selectedCategory}
                            products={displayedProducts}
                            filterName={activeFilter?.name}
                            isSearchActive={searchActive}
                            searchCount={displayedProducts.length}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Categories;
