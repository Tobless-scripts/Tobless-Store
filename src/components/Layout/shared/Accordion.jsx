import React, { useState } from "react";

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-4 justify-start items-center">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        onClick={() => toggleIndex(index)}
                        className="transition-all duration-300 ease-in-out border-b border-[#e0e5eb]"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="group inline-block relative overflow-hidden">
                                <div className="flex justify-between items-center cursor-pointer">
                                    <h3 className="relative text-gray-900 dark:text-gray-200 font-semibold text-xl leading-7">
                                        {item.title}
                                        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-400 dark:bg-gray-200 transition-all duration-300 group-hover:w-full"></span>
                                    </h3>

                                    <h3 className="text-gray-900 dark:text-gray-200 transition-all ease-in-out font-normal text-3xl leading-9">
                                        {isOpen ? "-" : "+"}
                                    </h3>
                                </div>
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isOpen
                                        ? "max-h-258 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="p-4 text-gray-700 dark:text-gray-300">
                                    {typeof item.content === "string" ? (
                                        <p>{item.content}</p>
                                    ) : (
                                        item.content
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;
