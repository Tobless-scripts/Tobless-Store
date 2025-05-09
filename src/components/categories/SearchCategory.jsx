import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

            const productSuggestions = foundProducts
                .map((p) => p.title)
                .slice(0, 5);
            const categorySuggestions = [
                ...new Set(foundProducts.map((p) => p.category)),
            ].slice(0, 3);

            setSuggestions([...productSuggestions, ...categorySuggestions]);
            onSearch(searchTerm, foundProducts);
            setShowSuggestions(true);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, products, onSearch]);

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm("");
        setShowSuggestions(false);

        const exactProductMatches = products.filter(
            (product) =>
                product.title.toLowerCase() === suggestion.toLowerCase()
        );

        if (exactProductMatches.length > 0) {
            onSearch("", exactProductMatches);
            const firstMatchCategory = exactProductMatches[0].category;
            const categoryIndex = menuItems.findIndex(
                (item) => item.category === firstMatchCategory
            );
            if (categoryIndex !== -1) {
                setActiveIndex(categoryIndex);
                setSelectedCategory(firstMatchCategory);
            }
        } else {
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
                onSearch(searchLower, []);
            }
        }
    };

    return (
        <div ref={searchRef}>
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products, categories, brands..."
                    className="w-full px-4 py-2 bg-transparent border text-gray-800 dark:text-gray-200 mx-auto border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-none lg:w-full md:w-full sm:w-full"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full md:w-1/2 mt-1 bg-white border-none rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
