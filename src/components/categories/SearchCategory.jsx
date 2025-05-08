import React, { useState, useEffect, useRef } from "react";

const ProductSearch = ({
    products,
    onSearch,
    menuItems,
    setActiveIndex,
    setSelectedCategory,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setSuggestions([]);
                onSearch("", []);
                return;
            }

            const searchLower = searchTerm.toLowerCase();
            const foundProducts = products.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower) ||
                    product.brand?.toLowerCase().includes(searchLower) ||
                    product.description?.toLowerCase().includes(searchLower)
            );

            // Generate suggestions from found products
            const productSuggestions = foundProducts
                .map((p) => p.title)
                .slice(0, 5);
            const categorySuggestions = [
                ...new Set(foundProducts.map((p) => p.category)),
            ].slice(0, 3);

            setSuggestions([...productSuggestions, ...categorySuggestions]);
            onSearch(searchTerm, foundProducts);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, products, onSearch]);

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(""); // Clear the input field
        setShowSuggestions(false);

        // Find exact product matches for the suggestion
        const exactProductMatches = products.filter(
            (product) =>
                product.title.toLowerCase() === suggestion.toLowerCase()
        );

        if (exactProductMatches.length > 0) {
            // If we found exact product matches, show only those products
            onSearch("", exactProductMatches);

            // Find the category of the first matching product
            const firstMatchCategory = exactProductMatches[0].category;
            const categoryIndex = menuItems.findIndex(
                (item) => item.category === firstMatchCategory
            );

            if (categoryIndex !== -1) {
                // Update the active category
                setActiveIndex(categoryIndex);
                setSelectedCategory(firstMatchCategory);
            }
        } else {
            // Fallback to category search if no exact product match
            const searchLower = suggestion.toLowerCase();
            const foundProducts = products.filter(
                (product) => product.category.toLowerCase() === searchLower
            );

            if (foundProducts.length > 0) {
                onSearch("", foundProducts);
                const categoryIndex = menuItems.findIndex(
                    (item) => item.category.toLowerCase() === searchLower
                );
                if (categoryIndex !== -1) {
                    setActiveIndex(categoryIndex);
                    setSelectedCategory(searchLower);
                }
            } else {
                // Final fallback to regular search
                const foundProducts = products.filter(
                    (product) =>
                        product.title.toLowerCase().includes(searchLower) ||
                        product.category.toLowerCase().includes(searchLower)
                );
                onSearch("", foundProducts);
            }
        }
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <input
                type="text"
                placeholder="Search products, categories, brands..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full lg:w-1/2 px-4 py-2 border text-gray-800 dark:text-gray-200 mx-auto border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-none"
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full lg:w-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductSearch;
