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

            setSuggestions(foundProducts);
            onSearch(searchTerm, foundProducts);
            setShowSuggestions(foundProducts.length > 0);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, products, onSearch]);

    const handleSelectSuggestion = (product) => {
        setSearchTerm("");
        setShowSuggestions(false);

        const categoryItem = menuItems.find(
            (item) => item.category === product.category
        );

        if (categoryItem) {
            onSearch("", [product]);
            const categoryIndex = menuItems.findIndex(
                (item) => item.category === product.category
            );
            if (categoryIndex !== -1) {
                setActiveIndex(categoryIndex);
                setSelectedCategory(product.category);
            }
        } else {
            onSearch("", []);
        }
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    placeholder="Search products, categories, brands..."
                    className="w-full px-4 py-2 bg-transparent border text-gray-800 dark:text-gray-200 mx-auto border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-none"
                />
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSuggestions([]);
                            setShowSuggestions(false);
                        }}
                        className="cursor-pointer ml-2"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Search suggestions */}
            {showSuggestions && (
                <ul
                    role="listbox"
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.length > 0 ? (
                        suggestions.map((product) => {
                            const categoryItem = menuItems.find(
                                (item) => item.category === product.category
                            );

                            return (
                                <li
                                    key={product.id}
                                    role="option"
                                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                                        !categoryItem
                                            ? "text-gray-500 italic"
                                            : "text-black dark:text-white"
                                    }`}
                                    onClick={() =>
                                        handleSelectSuggestion(product)
                                    }
                                >
                                    {product.title}
                                    {categoryItem ? (
                                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {categoryItem.name}
                                        </span>
                                    ) : (
                                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Category not available
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-2 text-gray-500 dark:text-gray-400 italic">
                            No results found for "{searchTerm}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ProductSearch;
