import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";

const Footer = () => {
    const navigate = useNavigate();

    const categories = [
        "all-products",
        "smartphones",
        "tablets",
        "laptops",
        "mobile-accessories",
        "sport-accessories",
        "fragrances",
        "skin-care",
        "mens-watches",
        "mens-shirts",
        "mens-shoes",
        "groceries",
        "home-decoration",
        "kitchen-accessories",
        "furniture",
        "tops",
        "sunglasses",
        "womens-watches",
        "womens-shoes",
        "womens-bags",
        "womens-jewellery",
        "womens-dresses",
        "vehicle",
        "motorcycle",
    ];

    // Function to format category for display (capitalize first letters)
    const formatCategoryDisplay = (category) => {
        if (category === "all-products") return "All Products";
        return category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleCategoryClick = (category) => {
        if (category === "All Products") {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        navigate(category ? `/categories?category=${category}` : "/categories");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const helpOptions = [
        { id: 1, name: "Help center & FAQ" },
        { id: 2, name: "Support chat" },
        { id: 3, name: "Open support ticket" },
        { id: 4, name: "Call center" },
    ];

    const [selectedHelpOption, setSelectedHelpOption] = useState(null);

    const handleHelpSelect = (selectedOption) => {
        setSelectedHelpOption(selectedOption);
        console.log("Selected help option:", selectedOption);
    };

    return (
        <>
            <footer className="bg-gray-800 text-white pt-12 px-10 lg:px-12 pb-8 text-center md:text-left">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-16">
                        <div className="flex flex-col items-center gap-2 mb-8 lg:items-start">
                            <NavLink
                                to="/"
                                className="flex-shrink-0 mb-4 transition-all duration-300 ease-in-out"
                            >
                                <h1 className="text-gray-200 text-xl md:text-2xl font-semibold">
                                    ToblessMart
                                </h1>
                            </NavLink>
                            <p className="text-sm font-normal leading-6 text-slate-400">
                                Got questions? Contact us 24/7
                            </p>
                            <div className="w-full text-black max-w-xs">
                                <CustomSelect
                                    options={helpOptions}
                                    onChange={handleHelpSelect}
                                    placeholder="Select help option"
                                    value={selectedHelpOption}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                    Help and consultation
                                </h3>
                                <ul className="space-y-2 text-sm font-normal leading-6 text-white">
                                    {[
                                        "Payment methods",
                                        "Money back guarantee",
                                        "Product returns",
                                        "Support center",
                                        "Shipping",
                                        "Terms & conditions",
                                    ].map((item, index) => (
                                        <li key={index}>
                                            <button className="text-gray-400 hover:text-white transition-colors duration-200">
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                    Company
                                </h3>
                                <ul className="space-y-2 text-sm font-normal leading-6 text-white">
                                    {[
                                        "About company",
                                        "Our team",
                                        "Careers",
                                        "Contact us",
                                        "News",
                                    ].map((item, index) => (
                                        <li key={index}>
                                            <button className="text-gray-400 hover:text-white transition-colors duration-200">
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                    Account
                                </h3>
                                <ul className="space-y-2 text-sm font-normal leading-6 text-white">
                                    {[
                                        "Your account",
                                        "Shipping rates & policies",
                                        "Refunds & replacements",
                                        "Delivery info",
                                        "Order tracking",
                                        "Taxes & fees",
                                    ].map((item, index) => (
                                        <li key={index}>
                                            <button className="text-gray-400 hover:text-white transition-colors duration-200">
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex flex-wrap gap-x-2 gap-y-2 mb-4 md:mb-0">
                                {categories.map((category, index) => (
                                    <div key={index}>
                                        <button
                                            onClick={() =>
                                                handleCategoryClick(category)
                                            }
                                            className={`text-gray-400 hover:text-white space-y-2 text-sm font-normal leading-6 transition-colors duration-200 cursor-pointer`}
                                        >
                                            {formatCategoryDisplay(category)}
                                        </button>{" "}
                                        {index < categories.length - 1 && (
                                            <span className="text-gray-400 space-y-2 text-sm font-normal leading-6 transition-colors duration-200">
                                                /
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pb-6 pt-12">
                        <p className="text-slate-400 text-xs font-normal leading-snug">
                            © {new Date().getFullYear()} Tobless Mart. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
