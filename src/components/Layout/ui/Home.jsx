import ProductCarousel from "../shared/ProductCarousel";
import ProductSwiper from "../shared/ProductSwiper";
import HomeProduct from "../shared/HomeProduct";

function Home() {
    return (
        <>
            <div>
                <ProductSwiper />
                <ProductCarousel />
                <HomeProduct />
            </div>
        </>
    );
}

export default Home;
