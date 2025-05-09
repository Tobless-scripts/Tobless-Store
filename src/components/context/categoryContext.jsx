import { createContext, useContext } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const menuItems = [
        { name: "All Products", category: "" },
        { name: "Smartphones", category: "smartphones" },
        { name: "Tablets", category: "tablets" },
        { name: "Laptops", category: "laptops" },
        { name: "Mobile accessories", category: "mobile-accessories" },
        { name: "Sport accessories", category: "sports-accessories" },
        { name: "Fragrances", category: "fragrances" },
        { name: "Skin care", category: "skin-care" },
        { name: "Mens watches", category: "mens-watches" },
        { name: "Mens shirts", category: "mens-shirts" },
        { name: "Mens shoes", category: "mens-shoes" },
        { name: "Groceries", category: "groceries" },
        { name: "Home Decoration", category: "home-decoration" },
        { name: "Kitchen accessories", category: "kitchen-accessories" },
        { name: "Furniture", category: "furniture" },
        { name: "Tops", category: "tops" },
        { name: "Sunglasses", category: "sunglasses" },
        { name: "Women watches", category: "womens-watches" },
        { name: "Women shoes", category: "womens-shoes" },
        { name: "Women bags", category: "womens-bags" },
        { name: "Women jewellery", category: "womens-jewellery" },
        { name: "Women dresses", category: "womens-dresses" },
        { name: "Vehicle", category: "vehicle" },
        { name: "Motorcycle", category: "motorcycle" },
    ];

    const value = { menuItems };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = () => useContext(CategoryContext);
