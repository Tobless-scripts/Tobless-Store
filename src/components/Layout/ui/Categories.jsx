import { useState, useEffect, useRef } from "react";
import ShopCatalog from "../../categories/ShopCatalog";
import { useCallback } from "react";
import CustomSelect from "../shared/CustomSelect";
import { ClipLoader } from "react-spinners";
import ProductSearch from "../../categories/SearchCategory";
import Footer from "../shared/Footer";
import { useCategory } from "../../context/categoryContext";
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

const ChainMenu = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchActive, setSearchActive] = useState(false);

    const { menuItems } = useCategory();

    const filterItems = [
        { id: 1, name: "Most Popular" },
        { id: 2, name: "Best Match" },
        { id: 3, name: "Newest Arrivals" },
        { id: 4, name: "Price: Low to High" },
        { id: 5, name: "Price: High to Low" },
        { id: 6, name: "Highest Rating" },
    ];

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

    // Fetch products by category
    const fetchProductsByCategory = useCallback(
        async (category = "") => {
            if (!category) {
                setCategoryProducts(allProducts);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://dummyjson.com/products/category/${category}`
                );
                const data = await response.json();
                setCategoryProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products by category:", error);
            } finally {
                setLoading(false);
            }
        },
        [allProducts]
    );

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    useEffect(() => {
        if (allProducts.length > 0) {
            fetchProductsByCategory(selectedCategory);
        }
    }, [selectedCategory, allProducts, fetchProductsByCategory]);

    // In your ChainMenu component, add this useEffect
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const categoryParam = searchParams.get("category");

        if (categoryParam) {
            const categoryIndex = menuItems.findIndex(
                (item) => item.category === categoryParam
            );

            if (categoryIndex !== -1) {
                setActiveIndex(categoryIndex);
                setSelectedCategory(categoryParam);
                fetchProductsByCategory(categoryParam);
            }
        }
    }, [
        menuItems,
        fetchProductsByCategory,
        setActiveIndex,
        setSelectedCategory,
    ]);

    const handleMenuItemClick = (index, category) => {
        setActiveIndex(index);
        setSelectedCategory(category);
        setActiveFilter(null);
        setSearchActive(false);
        setDisplayedProducts(categoryProducts);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Modify your filter function to preserve search results
    const applyFilter = (filterType) => {
        const productsToFilter = searchActive
            ? displayedProducts
            : categoryProducts;

        if (!productsToFilter.length) return;

        let sortedProducts = [...productsToFilter];

        switch (filterType?.id) {
            case 1: // Best Match
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 2: // Most Popular
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;

            case 3: // Newest Arrivals
                sortedProducts.sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
                break;
            case 4: // Price: Low to High
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 5: // Price: High to Low
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 6: // Highest Rating
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            default: // Best Match (case 2)
                // Keep original order
                break;
        }

        setDisplayedProducts(sortedProducts);
        setActiveFilter(filterType);

        // Scroll to top when applying filters
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSearchResults = (searchTerm, foundProducts) => {
        if (!searchTerm.trim()) {
            // When search is cleared, show current category products
            setDisplayedProducts(categoryProducts);
            setSearchActive(false);
            return;
        }

        setSearchActive(true);
        setDisplayedProducts(foundProducts);

        // Scroll to top when showing search results
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        // Only update category if we found results and search term isn't empty
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
                                defaultValue={menuItems[activeIndex]}
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
                        <div>
                            <CustomSelect
                                options={filterItems}
                                defaultValue={filterItems[1]}
                                onChange={applyFilter}
                                placeholder="Filter by"
                            />
                        </div>

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
                    {/* Search Component - Desktop (above products) */}
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

export default ChainMenu;
