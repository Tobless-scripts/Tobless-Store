import { forwardRef, useEffect, useCallback, useState, useRef } from "react";
import { X, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { selectUserId } from "../../../../redux/features/auth/authSlice";
import {
    removeFromCart,
    updateQuantity,
    setCartFromLocalStorage,
} from "../../../../redux/features/cart/cartSlice";
import { showNotification } from "../../../../redux/features/notifications/notificationSlice";
import { RemovedFromCartNotification } from "../notifications/RemovedFromCartNotification";
import { closeAllPanels } from "../../../../redux/features/ui/uiSlice";
import LoginPrompt from "../account/LoginPrompt";

const Cart = forwardRef((_, ref) => {
    const navigate = useNavigate();
    const [hasInitialized, setHasInitialized] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const isCartOpen = useSelector((state) => state.ui.isCartOpen);
    const contentRef = useRef(null);

    // Memoized cart operations
    const subtotal = useCallback(
        () =>
            cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        [cartItems]
    );

    const closeCart = useCallback(() => dispatch(closeAllPanels()), [dispatch]);
    const userId = useSelector(selectUserId);

    // Load and persist cart data
    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        dispatch(setCartFromLocalStorage(savedCart));
        setHasInitialized(true); // Mark initialization complete
    }, [dispatch, userId]);

    // Scroll to top when cart opens
    useEffect(() => {
        if (isCartOpen && contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [isCartOpen]);

    useEffect(() => {
        if (!hasInitialized) return; // Skip first render

        if (cartItems.length > 0) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
        } else {
            localStorage.removeItem(`cart_${userId}`);
        }
    }, [cartItems, userId, hasInitialized]);

    const handleCheckout = useCallback(() => {
        if (!userId) {
            setShowLoginPrompt(true);
            return;
        }
        closeCart();
        navigate("/checkout");
    }, [userId, closeCart, navigate]);

    const handleRemoveFromCart = useCallback(
        (product) => {
            dispatch(removeFromCart(product.id));
            dispatch(
                showNotification({
                    message: <RemovedFromCartNotification product={product} />,
                    type: "success",
                })
            );
        },
        [dispatch]
    );

    const handleQuantityChange = useCallback(
        (id, newQuantity) => {
            if (newQuantity < 1) return;
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        },
        [dispatch]
    );

    if (showLoginPrompt) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isCartOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={closeCart}
            />

            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex h-full flex-col p-6">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Your Cart ({cartItems.length})
                        </h2>
                        <button
                            onClick={closeCart}
                            aria-label="Close cart"
                            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="h-6 w-6 text-gray-800 dark:text-white cursor-pointer" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div ref={contentRef} className="flex-grow overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <EmptyCart closeCart={closeCart} />
                        ) : (
                            <CartItemList
                                items={cartItems}
                                onQuantityChange={handleQuantityChange}
                                onRemoveItem={handleRemoveFromCart}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <CartFooter
                            subtotal={subtotal()}
                            closeCart={closeCart}
                            onCheckout={handleCheckout}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

// Sub-components remain the same as in your original code
const EmptyCart = ({ closeCart }) => (
    <div className="flex h-full gap-6 flex-col items-center justify-center">
        <ShoppingCart size={96} className="text-gray-800 dark:text-gray-200" />
        <p className="text-gray-900 dark:text-gray-200 text-lg font-semibold">
            Your shopping cart is empty
        </p>
        <h2 className="mb-4 text-gray-600 dark:text-gray-400 text-sm text-center">
            Explore our wide range of products and add items to your cart to
            proceed with your purchase.
        </h2>
        <NavLink
            to="/shop"
            onClick={closeCart}
            className="rounded-full bg-primary px-6 py-2 text-gray-900 dark:text-white hover:bg-primary-dark"
        >
            Continue Shopping
        </NavLink>
    </div>
);

const CartItemList = ({ items, onQuantityChange, onRemoveItem }) => (
    <div className="space-y-4">
        {items.map((item) => (
            <div
                key={item.id}
                className="flex items-center gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
            >
                <div className="bg-gray-100 flex justify-center items-center dark:bg-gray-700 w-24 h-24 rounded-lg">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                    />
                </div>
                <div className="flex-grow">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                        {item.title}
                    </h3>
                    <div className="flex items-center mt-1">
                        <span className="text-lg font-bold text-gray-900">
                            ${item.price}
                        </span>
                    </div>
                    <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() =>
                            onQuantityChange(item.id, item.quantity - 1)
                        }
                        onIncrease={() =>
                            onQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity <= 1}
                    />
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={() => onRemoveItem(item)}
                        className="text-gray-500 hover:text-red-500"
                        aria-label={`Remove ${item.title}`}
                    >
                        <X className="h-5 w-5 cursor-pointer" />
                    </button>
                </div>
            </div>
        ))}
    </div>
);

const QuantityControl = ({ quantity, onDecrease, onIncrease, disabled }) => (
    <div className="mt-2 flex items-center">
        <button
            onClick={onDecrease}
            disabled={disabled}
            className={`rounded-l-md border-1 text-gray-700 dark:text-gray-200 border-gray-200 px-3 py-1 ${
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
            -
        </button>
        <span className="border-1 border-gray-200 text-gray-700 dark:text-gray-200 px-3 py-1">
            {quantity}
        </span>
        <button
            onClick={onIncrease}
            className="rounded-r-md border-1 text-gray-700 dark:text-gray-200 border-gray-200 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            +
        </button>
    </div>
);

const CartFooter = ({ subtotal, closeCart, onCheckout }) => (
    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-200">
                Subtotal
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
                ${subtotal.toFixed(2)}
            </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
            <NavLink to="/shop" onClick={closeCart} className="w-full">
                <button className="w-full rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 py-2 px-4 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer ">
                    Continue Shopping
                </button>
            </NavLink>
            <div onClick={onCheckout} className="w-full">
                <button className="w-full rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 py-2 px-4 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer">
                    Proceed to checkout
                </button>
            </div>
        </div>
    </div>
);

Cart.displayName = "Cart";
export default Cart;
