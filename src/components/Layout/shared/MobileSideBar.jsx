import { X, LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";
import { toggleCart, toggleWishlist } from "../../../redux/features/ui/uiSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

const SidebarMenu = ({ isOpen, toggleSidebar, closeSidebar }) => {
    const dispatch = useDispatch();

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

    // Toggle cart visibility
    const handleCartClick = (e) => {
        e.preventDefault();
        dispatch(toggleCart());
    };

    // Toggle wishlist visibility
    const handleWishlistClick = (e) => {
        e.preventDefault();
        dispatch(toggleWishlist());
    };

    const accountItems = [
        {
            name: "Orders",
            category: "orders",
            icon: "ShoppingCart",
            linkTo: "/cart",
            onClick: handleCartClick,
        },
        { name: "Inbox", category: "inbox", icon: "Inbox", linkTo: "/inbox" },
        {
            name: "Pending Reviews",
            category: "pending-reviews",
            icon: "Clock",
            linkTo: "/pending",
        },
        {
            name: "Voucher",
            category: "voucher",
            icon: "Receipt",
            linkTo: "/voucher",
        },
        {
            name: "Wishlist",
            category: "wishlist",
            icon: "Heart",
            linkTo: "/wishlist",
            onClick: handleWishlistClick,
        },
    ];

    // Fallback icon
    const getIcon = (name) => {
        const iconName = name.split(" ")[0];
        const IconComponent = LucideIcons[iconName] || LayoutGrid;
        return <IconComponent size={18} />;
    };

    const getNavLinkClass = ({ isActive }) =>
        `text-sm leading-[1] transition-all duration-300 w-max ease-in-out font-medium group relative inline-block overflow-hidden py-1 ${
            isActive
                ? "text-gray-800 dark:border-white dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        }`;

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 px-2 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex items-center gap-4 py-4 px-3 dark:border-gray-700">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-800 dark:text-gray-200 cursor-pointer"
                >
                    <X />
                </button>

                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex-shrink-0"
                    onClick={closeSidebar}
                >
                    <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl font-semibold">
                        ToblessStore
                    </h1>
                </NavLink>
            </div>

            <div className="px-4" onClick={closeSidebar}>
                <NavLink to="/faq">
                    <div className="flex items-center justify-between cursor-pointer my-2 hover:bg-gray-100 p-2 transition ease-in-out">
                        <h2 className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase">
                            Need Help?
                        </h2>
                        <ChevronRight size={20} />
                    </div>
                </NavLink>
            </div>

            <div className="px-4 pb-4" onClick={closeSidebar}>
                <NavLink to="/account">
                    <div className="flex items-center justify-between cursor-pointer my-2 hover:bg-gray-100 p-2 transition ease-in-out">
                        <h2 className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase">
                            My ToblessStore Account
                        </h2>
                        <ChevronRight size={20} />
                    </div>
                </NavLink>
                <ul className="space-y-3">
                    {accountItems.map((item) => {
                        const Icon = LucideIcons[item.icon] || LayoutGrid;
                        return (
                            <li
                                key={item.name}
                                className="flex items-center gap-3"
                            >
                                <Icon size={18} />
                                <NavLink
                                    to={item.linkTo}
                                    className={getNavLinkClass}
                                    end
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            item.onClick(e);
                                        }
                                        closeSidebar;
                                    }}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="p-4 space-y-4" onClick={closeSidebar}>
                <NavLink to="/account">
                    <div className="flex items-center justify-between cursor-pointer my-2 hover:bg-gray-100 p-2 transition ease-in-out">
                        <h2 className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase">
                            OUR CATEGORIES
                        </h2>
                        <ChevronRight size={20} />
                    </div>
                </NavLink>
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.name} className="flex items-center gap-3">
                            {getIcon(item.name)}
                            <NavLink
                                to={
                                    item.category
                                        ? `/categories?category=${item.category}`
                                        : "/categories"
                                }
                                className={getNavLinkClass}
                                end
                                onClick={closeSidebar} // Close sidebar when clicking a link
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidebarMenu;
