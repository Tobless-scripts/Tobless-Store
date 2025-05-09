import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import { NavLink } from "react-router-dom";

const Footer = () => {
    const categories = [
        "All Products",
        "Smartphones",
        "Tablets",
        "Laptops",
        "Mobile accessories",
        "Sport accessories",
        "Fragrances",
        "Skin care",
        "Mens watches",
        "Mens shirts",
        "Mens shoes",
        "Groceries",
        "Home Decoration",
        "Kitchen accessories",
        "Furniture",
        "Tops",
        "Sunglasses",
        "Women watches",
        "Women shoes",
        "Women bags",
        "Women jewellery",
        "Women dresses",
        "Vehicle",
        "Motorcycle",
    ];

    const helpOptions = [
        { id: 1, name: "Help center & FAQ" },
        { id: 2, name: "Support chat" },
        { id: 3, name: "Open support ticket" },
        { id: 4, name: "Call center" },
    ];

    const [selectedHelpOption, setSelectedHelpOption] = useState(null);

    const handleHelpSelect = (selectedOption) => {
        setSelectedHelpOption(selectedOption);
        // You can add additional logic here when an option is selected
        console.log("Selected help option:", selectedOption);
    };

    return (
        <footer className="bg-gray-800 text-white pt-12 px-4 lg:px-12 pb-8 text-center md:text-left">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-16">
                    <div className="flex flex-col items-center gap-2 mb-8 lg:items-start">
                        {/* Logo */}
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
                        {/* Help and Consultation Column */}
                        <div>
                            <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                Help and consultation
                            </h3>
                            <ul className="space-y-2 text-sm font-normal leading-6 text-white ">
                                {[
                                    "Payment methods",
                                    "Money back guarantee",
                                    "Product returns",
                                    "Support center",
                                    "Shipping",
                                    "Terms & conditions",
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href="/categories"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                Company
                            </h3>
                            <ul className="space-y-2 text-sm font-normal leading-6 text-white ">
                                {[
                                    "About company",
                                    "Our team",
                                    "Careers",
                                    "Contact us",
                                    "News",
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href="/categories"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Account Column */}
                        <div>
                            <h3 className="text-white font-semibold text-base leading-normal mb-4">
                                Account
                            </h3>
                            <ul className="space-y-2 text-sm font-normal leading-6 text-white ">
                                {[
                                    "Your account",
                                    "Shipping rates & policies",
                                    "Refunds & replacements",
                                    "Delivery info",
                                    "Order tracking",
                                    "Taxes & fees",
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href="/categories"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Category Links and Copyright */}
                <div className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex flex-wrap gap-x-3 gap-y-2 mb-4 md:mb-0">
                            {categories.map((category, index) => (
                                <React.Fragment key={index}>
                                    <a
                                        href="/categories"
                                        className="text-gray-400 hover:text-white space-y-2 text-sm font-normal leading-6 transition-colors duration-200"
                                    >
                                        {category}
                                    </a>
                                    {index < categories.length - 1 && (
                                        <span className="text-gray-400  space-y-2 text-sm font-normal leading-6 transition-colors duration-200">
                                            /
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pb-6 pt-12">
                    <p className="text-slate-400 text-xs font-normal leading-snug">
                        © {new Date().getFullYear()} Tobless Mart. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
