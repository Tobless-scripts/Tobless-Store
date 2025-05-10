import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { memo } from "react";

const CustomSelect = memo(
    ({
        options,
        value,
        buttonClassName = "",
        optionClassName = "",
        placeholder = "Select an option",
        onChange,
    }) => {
        return (
            <div className="relative w-full">
                <Listbox value={value} onChange={onChange}>
                    {({ open }) => (
                        <div>
                            <Listbox.Button
                                className={`w-full py-3 px-6 rounded-full cursor-pointer border border-gray-300 text-base leading-6 bg-white outline-none focus:border-gray-900 flex justify-between items-center transition-colors duration-200 hover:border-gray-400 ${buttonClassName}`}
                            >
                                <span className="truncate">
                                    {value?.name || placeholder}
                                </span>
                                <ChevronDown
                                    className={`ml-2 text-gray-600 transition-transform duration-200 ${
                                        open ? "transform rotate-180" : ""
                                    }`}
                                    size={20}
                                    aria-hidden="true"
                                />
                            </Listbox.Button>
                            <Listbox.Options className="absolute mt-1 w-full max-h-60 z-50 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option.id}
                                        value={option}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700"
                                            } ${optionClassName}`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {option.name}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                        <Check
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    )}
                </Listbox>
            </div>
        );
    }
);

export default CustomSelect;
