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

// Lazy load page components
const Category = lazy(() => import("../Layout/ui/Categories"));
const Signup = lazy(() => import("../../pages/auth/Signup"));
const Login = lazy(() => import("../../pages/auth/Login"));
const Faq = lazy(() => import("../../pages/static/FAQ"));
const Home = lazy(() => import("../Layout/ui/Home"));
const ProductDetails = lazy(() => import("../Layout/ui/ProductDetails"));
const Shop = lazy(() => import("../Layout/ui/Shop"));
const AccountOverview = lazy(() =>
    import("../Layout/ui/account/AccountOverview")
);

function AppRoutes() {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initAuthListener());
    }, [dispatch]);

    return (
        <div>
            {!["/signup", "/login"].includes(location.pathname) && <Header />}
            <Suspense fallback={<LoadingSpinner />}>
                <ScrollToTopButton />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/account" element={<AccountOverview />} />
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
            <Router>
                <AppRoutes />
            </Router>
        </Provider>
    );
}

export default App;
