import { Link } from "react-router-dom";

const LoginPrompt = () => {
    return (
        <div className="min-h-fit bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                    🔒
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Login Required
                </h2>
                <p className="text-gray-600 mb-6">
                    You need to log in to view and edit your account details.
                </p>
                <div className="flex flex-col space-y-3">
                    <Link
                        to="/login"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                        Log In Now
                    </Link>
                    <Link
                        to="/signup"
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                        Create Account
                    </Link>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                    <h3 className="flex flex-col gap-y-4">
                        <p className="text-sm text-gray-500">
                            New user?{" "}
                            <Link
                                to="/signup"
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default LoginPrompt;
