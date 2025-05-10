import { useState, useEffect } from "react";
import {
    ChevronRight,
    MapPin,
    User,
    ShoppingCart,
    Heart,
    LogOut,
    Edit,
    Save,
    X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../../../firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { selectUserId } from "../../../../redux/features/auth/authSlice";
import {
    toggleCart,
    toggleWishlist,
} from "../../../../redux/features/ui/uiSlice";
import { useNavigate } from "react-router-dom";
import LoginPrompt from "./LoginPrompt";

const EditAddress = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector(selectUserId);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({
        firstName: "",
        email: "",
        phonePrefix: "+234",
        phoneNumber: "",
        additionalPhone: "",
        street: "",
        additionalInfo: "",
        region: "Select region",
        city: "Select city",
    });

    const [tempAddress, setTempAddress] = useState({ ...address });

    // Helper function to safely check for placeholder text
    const isPlaceholder = (value, placeholder) => {
        if (!value || typeof value !== "string") return true;
        return value.includes(placeholder);
    };

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

    // Load address from Firestore on component mount
    useEffect(() => {
        const loadAddress = async () => {
            try {
                const docRef = doc(db, "addresses", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Ensure all fields have values
                    const loadedAddress = {
                        firstName: data.firstName || "Enter your full name",
                        email: data.email || "Enter your email",
                        phonePrefix: data.phonePrefix || "+234",
                        phoneNumber:
                            data.phoneNumber || "Enter your phone number",
                        additionalPhone:
                            data.additionalPhone ||
                            "Enter your second phone number",
                        street: data.street || "Enter your address",
                        additionalInfo: data.additionalInfo || "",
                        region: data.region || "Select region",
                        city: data.city || "Select city",
                    };
                    setAddress(loadedAddress);
                    setTempAddress(loadedAddress);
                } else {
                    // Initialize with default values
                    const defaultAddress = {
                        firstName: "Enter your full name",
                        email: "Enter your email",
                        phonePrefix: "+234",
                        phoneNumber: "Enter your phone number",
                        additionalPhone: "Enter your second phone number",
                        street: "Enter your address",
                        additionalInfo: "",
                        region: "Select region",
                        city: "Select city",
                    };
                    await setDoc(docRef, defaultAddress);
                    setAddress(defaultAddress);
                    setTempAddress(defaultAddress);
                }
            } catch (error) {
                console.error("Error loading address:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadAddress();
        }
    }, [userId]);

    // If user is not logged in, show LoginPrompt
    if (!userId) {
        return <LoginPrompt />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setTempAddress({ ...address });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Save to firestore
            const addressToSave = {
                firstName: tempAddress.firstName || "",
                email: tempAddress.email || "",
                phonePrefix: tempAddress.phonePrefix || "+234",
                phoneNumber: tempAddress.phoneNumber || "",
                additionalPhone: tempAddress.additionalPhone || "",
                street: tempAddress.street || "",
                additionalInfo: tempAddress.additionalInfo || "",
                region: tempAddress.region || "Select region",
                city: tempAddress.city || "Select city",
            };

            await setDoc(doc(db, "addresses", userId), addressToSave);
            setAddress(addressToSave);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading your address...
                    </p>
                </div>
            </div>
        );
    }

    const logout = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out.");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error during logout:", error.message);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                    {/* Sidebar Navigation */}
                    <div className="bg-white rounded-lg shadow p-4 h-fit">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                <User size={18} className="text-gray-600" /> My
                                Account
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={handleCartClick}
                                        className="flex items-center justify-between w-full text-gray-600 hover:text-black hover:bg-gray-100 py-2 px-1 transition-all ease-in-out duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart size={16} /> Cart
                                        </div>
                                        <ChevronRight size={16} />
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleWishlistClick}
                                        className="flex items-center justify-between w-full text-gray-600 hover:text-black hover:bg-gray-100 py-2 px-1 transition-all ease-in-out duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Heart size={16} /> Wishlist
                                        </div>
                                        <ChevronRight size={16} />
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="flex items-center justify-between w-full text-gray-600 hover:text-black hover:bg-gray-100 py-2 px-1 transition-all ease-in-out duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut size={16} /> Logout
                                        </div>
                                        <ChevronRight size={16} />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Edit Address
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={handleEditClick}
                                    className="p-2 text-orange-500 hover:text-orange-700"
                                    aria-label="Edit address"
                                >
                                    <Edit size={20} />
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                                    >
                                        <Save size={16} /> Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 flex items-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Name Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={tempAddress.firstName}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                isPlaceholder(
                                                    address.firstName,
                                                    "Enter"
                                                )
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={tempAddress.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                isPlaceholder(
                                                    address.email,
                                                    "Enter"
                                                )
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Phone Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <div className="flex">
                                            <select
                                                name="phonePrefix"
                                                value={tempAddress.phonePrefix}
                                                onChange={handleChange}
                                                className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            >
                                                <option value="+234">
                                                    +234
                                                </option>
                                                <option value="+1">+1</option>
                                                <option value="+44">+44</option>
                                            </select>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={tempAddress.phoneNumber}
                                                onChange={handleChange}
                                                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            />
                                        </div>
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                isPlaceholder(
                                                    address.phoneNumber,
                                                    "Enter"
                                                )
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.phonePrefix}{" "}
                                            {address.phoneNumber}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Additional Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="additionalPhone"
                                            value={tempAddress.additionalPhone}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                !address.additionalPhone ||
                                                isPlaceholder(
                                                    address.additionalPhone,
                                                    "Enter"
                                                )
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.additionalPhone ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin size={18} /> Delivery Address
                                </h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="street"
                                            value={tempAddress.street}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                isPlaceholder(
                                                    address.street,
                                                    "Enter"
                                                )
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.street}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Additional Information
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="additionalInfo"
                                            value={tempAddress.additionalInfo}
                                            onChange={handleChange}
                                            placeholder="Enter Additional Information"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 ${
                                                !address.additionalInfo
                                                    ? "text-gray-400"
                                                    : "text-gray-800"
                                            } text-sm`}
                                        >
                                            {address.additionalInfo ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Region
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="region"
                                                value={tempAddress.region}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            >
                                                <option value="Ogun">
                                                    Ogun
                                                </option>
                                                <option value="Lagos">
                                                    Lagos
                                                </option>
                                                <option value="Abuja">
                                                    Abuja
                                                </option>
                                            </select>
                                        ) : (
                                            <p
                                                className={`p-2 ${
                                                    isPlaceholder(
                                                        address.region,
                                                        "Select"
                                                    )
                                                        ? "text-gray-400"
                                                        : "text-gray-800"
                                                } text-sm`}
                                            >
                                                {address.region}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="city"
                                                value={tempAddress.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            >
                                                <option value="Agbara (OPIC)">
                                                    Agbara (OPIC)
                                                </option>
                                                <option value="Lagos">
                                                    Lagos
                                                </option>
                                                <option value="Ibadan">
                                                    Ibadan
                                                </option>
                                            </select>
                                        ) : (
                                            <p
                                                className={`p-2 ${
                                                    isPlaceholder(
                                                        address.city,
                                                        "Select"
                                                    )
                                                        ? "text-gray-400"
                                                        : "text-gray-800"
                                                } text-sm`}
                                            >
                                                {address.city}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAddress;
