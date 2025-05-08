import { CheckCircle } from "lucide-react";

export const AddToCartNotification = ({ product }) => {
    return (
        <div className="flex items-center gap-2 p-3 text-sm font-medium rounded-md bg-green-50 text-green-800 border border-green-200">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p>
                <span className="font-bold">Added to cart: </span>
                {product.title}
            </p>
        </div>
    );
};
