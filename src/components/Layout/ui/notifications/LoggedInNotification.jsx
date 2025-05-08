import { CheckCircle } from "lucide-react";

export const LoggedInNotification = () => {
    return (
        <div className="flex items-center gap-2 p-3 text-sm font-medium rounded-md bg-red-50 text-red-800 border border-red-200">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p>
                <span className="font-bold">
                    Please login to manage your wishlist and cart
                </span>
            </p>
        </div>
    );
};
