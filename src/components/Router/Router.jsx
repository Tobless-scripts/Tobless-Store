import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { initAuthListener } from "../../redux/features/auth/authSlice";
import ScrollToTopButton from "../Layout/shared/ScrollToTopButton";
import Header from "../Layout/ui/Header";
import { Provider } from "react-redux";
import { store } from "../../redux/app/store";
import LoadingSpinner from "../Layout/shared/Loading";
import { CategoryProvider } from "../context/categoryContext";

// Lazy load page components
const Signup = lazy(() => import("../../pages/auth/Signup"));
const Login = lazy(() => import("../../pages/auth/Login"));
const Faq = lazy(() => import("../../pages/static/FAQ"));
const Home = lazy(() => import("../Layout/ui/Home"));
const ProductDetails = lazy(() => import("../Layout/ui/ProductDetails"));
const Categories = lazy(() => import("../Layout/ui/Categories"));
const AccountOverview = lazy(() =>
    import("../Layout/ui/account/AccountOverview")
);

function AppRoutes() {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initAuthListener());
    }, [dispatch]);

    const menuItems = [
        { name: "All Products", category: "" },
        { name: "Smartphones", category: "smartphones" },
        { name: "Tablets", category: "tablets" },
        { name: "Laptops", category: "laptops" },
        { name: "Mobile accessories", category: "mobile-accessories" },
        { name: "Sport accessories", category: "sports-accessories" },
        { name: "Fragrances", category: "fragrances" },
        { name: "Skin care", category: "skin-care" },
        { name: "Mens watches", category: "mens-watches" },
        { name: "Mens shirts", category: "mens-shirts" },
        { name: "Mens shoes", category: "mens-shoes" },
        { name: "Groceries", category: "groceries" },
        { name: "Home Decoration", category: "home-decoration" },
        { name: "Kitchen accessories", category: "kitchen-accessories" },
        { name: "Furniture", category: "furniture" },
        { name: "Tops", category: "tops" },
        { name: "Sunglasses", category: "sunglasses" },
        { name: "Women watches", category: "womens-watches" },
        { name: "Women shoes", category: "womens-shoes" },
        { name: "Women bags", category: "womens-bags" },
        { name: "Women jewellery", category: "womens-jewellery" },
        { name: "Women dresses", category: "womens-dresses" },
        { name: "Vehicle", category: "vehicle" },
        { name: "Motorcycle", category: "motorcycle" },
    ];

    return (
        <div>
            {!["/signup", "/login"].includes(location.pathname) && (
                <Header menuItems={menuItems} />
            )}
            <Suspense fallback={<LoadingSpinner />}>
                <ScrollToTopButton />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/account" element={<AccountOverview />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                        path="/product/:productId"
                        element={<ProductDetails />}
                    />
                </Routes>
            </Suspense>
        </div>
    );
}

function App() {
    return (
        <Provider store={store}>
            <CategoryProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </CategoryProvider>
        </Provider>
    );
}

export default App;
