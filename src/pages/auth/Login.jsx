import React, { useState } from "react";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../../firebase/Authentication/Login/EmailLogin";
import { loginWithGoogle } from "../../firebase/Authentication/Login/GoogleLogin";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const result = await loginWithGoogle();
        if (result.error) {
            setMessage(result.error);
        } else {
            setMessage("Logged in with Google successfully!");
            console.log("User:", result.user);
            navigate("/");
        }
    };

    const handleEmailLogin = async (e) => {
        setLogin(true);
        e.preventDefault();
        const result = await loginWithEmail(email, password);
        if (result.error) {
            setMessage(result.error);
        } else {
            setMessage("Logged in successfully!");
            console.log("User:", result.user);
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <p className="mt-2 flex justify-start items-center text-blue-600 hover:text-blue-500 text-sm text-gray-600">
                <ChevronLeft />
                <NavLink to="/" className="font-medium">
                    Go back
                </NavLink>
            </p>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    ToblessMart
                </h2>
                <h3 className="mt-2 text-center text-xl text-gray-600">
                    Welcome back
                </h3>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <NavLink
                        to="/signup"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Create an account
                    </NavLink>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {message && (
                        <div
                            className={`mb-4 text-sm ${
                                message.includes("successfully")
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleEmailLogin}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember for 30 days
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <hr className="my-6 border-gray-300" />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {login ? "Logging in..." : "Log in"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img
                                    src="https://www.google.com/favicon.ico"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                {loading ? "Loading..." : "Sign in with Google"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
