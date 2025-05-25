import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Check,
    X,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Lock,
    Mail,
    User,
    FileText,
    XCircle,
    Gift,
    Award,
    CheckCircle,
} from "lucide-react";
import { signUpWithEmailPassword } from "../../firebase/Authentication/Signup/signupEmail";
import { signUpWithGoogle } from "../../firebase/Authentication/Signup/signupGoogle";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [savePassword, setSavePassword] = useState(false);
    const [acceptPolicy, setAcceptPolicy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: "Very Weak",
        color: "text-red-600",
    });
    const [notification, setNotification] = useState({
        show: false,
        type: "",
        message: "",
    });

    useEffect(() => {
        const strengthLevels = [
            { message: "Very Weak", color: "text-red-600" },
            { message: "Weak", color: "text-orange-500" },
            { message: "Moderate", color: "text-yellow-500" },
            { message: "Strong", color: "text-blue-500" },
            { message: "Very Strong", color: "text-green-600" },
        ];

        const calculateStrength = () => {
            let score = 0;
            if (formData.password.length >= 8) score++;
            if (formData.password.match(/[A-Z]/)) score++;
            if (formData.password.match(/[0-9]/)) score++;
            if (formData.password.match(/[^A-Za-z0-9]/)) score++;

            setPasswordStrength(strengthLevels[score]);
        };

        if (formData.password) calculateStrength();
        else setPasswordStrength(strengthLevels[0]);
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const showNotification = (type, message, duration = 3000) => {
        setNotification({ show: true, type, message });
        setTimeout(
            () => setNotification((prev) => ({ ...prev, show: false })),
            duration
        );
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const result = await signUpWithGoogle();
            if (result.exists) {
                showNotification(
                    "error",
                    `Account already exists with ${result.providers.join(
                        " or "
                    )}. Please sign in instead.`
                );
            } else if (result.user) {
                showNotification(
                    "success",
                    "Account created successfully! Redirecting..."
                );
                setTimeout(() => navigate("/categories"), 500);
            }
        } catch (err) {
            showNotification(
                "error",
                err.message || "Failed to sign up with Google"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!acceptPolicy) {
            showNotification("error", "You must accept the Privacy Policy");
            setLoading(false);
            return;
        }

        try {
            const result = await signUpWithEmailPassword(
                formData.email,
                formData.password,
                { name: formData.name }
            );

            if (result.exists) {
                showNotification(
                    "error",
                    `Account already exists with ${result.providers.join(
                        " or "
                    )}. Please sign in instead.`
                );
            } else if (result.user) {
                showNotification(
                    "success",
                    "Account created successfully! Redirecting..."
                );
                setTimeout(() => navigate("/categories"), 1500);
            }
        } catch (err) {
            showNotification(
                "error",
                err.message || "Failed to create account"
            );
        } finally {
            setLoading(false);
        }
    };

    const Notification = () => {
        if (!notification.show) return null;

        const bgColor =
            notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";

        const icon =
            notification.type === "success" ? (
                <CheckCircle size={18} className="flex-shrink-0" />
            ) : (
                <XCircle size={18} className="flex-shrink-0" />
            );

        return (
            <div
                className={`fixed top-4 right-4 px-4 py-2 rounded-md flex items-center gap-2 z-50 animate-fade-in ${bgColor}`}
            >
                {icon}
                <span>{notification.message}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Notification />

            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20">
                <div className="max-w-md mx-auto">
                    <p className="my-4 flex justify-start items-center text-blue-600 hover:text-blue-500 text-sm text-gray-600">
                        <ChevronLeft />
                        <NavLink to="/categories" className="font-medium">
                            Go back
                        </NavLink>
                    </p>
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                        <Gift className="text-blue-600" size={28} />
                        ToblessMart
                    </h1>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Create an account
                        </h2>
                        <p className="text-gray-600 flex items-center gap-1">
                            <span>I already have an account</span>
                            <NavLink
                                to="/login"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Sign in <ChevronRight size={16} />
                            </NavLink>
                        </p>
                    </div>

                    <form onSubmit={handleEmailSignup} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                            >
                                <User size={16} /> Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                                <User
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                            >
                                <Mail size={16} /> Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                                <Mail
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                            >
                                <Lock size={16} /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                    required
                                    minLength="6"
                                />
                                <Lock
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>Password strength:</span>
                                        <span
                                            className={`font-medium ${passwordStrength.color}`}
                                        >
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full ${
                                                    i <= passwordStrength.score
                                                        ? passwordStrength.color.replace(
                                                              "text",
                                                              "bg"
                                                          )
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {passwordStrength.score < 3 && (
                                        <ul className="mt-2 text-xs text-gray-600 space-y-1">
                                            <li className="flex items-center gap-1">
                                                {formData.password.length >=
                                                8 ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>
                                                    At least 8 characters
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[A-Z]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>
                                                    At least one uppercase
                                                    letter
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[0-9]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>At least one number</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[^A-Za-z0-9]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>
                                                    At least one special
                                                    character
                                                </span>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="save-password"
                                    checked={savePassword}
                                    onChange={(e) =>
                                        setSavePassword(e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="save-password"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Save the password
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="privacy-policy"
                                    checked={acceptPolicy}
                                    onChange={(e) =>
                                        setAcceptPolicy(e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                                <label
                                    htmlFor="privacy-policy"
                                    className="ml-2 block text-sm text-gray-700 flex items-center gap-1"
                                >
                                    I have read and accept the{" "}
                                    <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                        Privacy Policy <FileText size={14} />
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create an account <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            {loading ? "Loading..." : "Sign up with Google"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 bg-blue-50 p-12 lg:p-20 flex-col justify-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Award size={24} className="text-blue-600" />
                    ToblessMart account benefits
                </h2>

                <ul className="space-y-6">
                    <li className="flex items-start">
                        <Check className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                        <p className="text-gray-700">
                            Subscribe to your favorite products
                        </p>
                    </li>
                    <li className="flex items-start">
                        <Check className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                        <p className="text-gray-700">
                            View and manage your orders and wishlist
                        </p>
                    </li>
                    <li className="flex items-start">
                        <Check className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                        <p className="text-gray-700">
                            Earn rewards for future purchases
                        </p>
                    </li>
                    <li className="flex items-start">
                        <Check className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                        <p className="text-gray-700">
                            Receive exclusive offers and discounts
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Signup;
