import { Leaf, ShieldCheck, Truck } from "lucide-react";
function Provide() {
    const provides = [
        {
            id: 1,
            image: Leaf,
            topic: "Eco-friendly",
            content:
                "Decorate your space with eco-friendly products with low VOCs, environmentally friendly materials and safe coatings.",
        },
        {
            id: 2,
            image: ShieldCheck,
            topic: "Unbeatable quality",
            content:
                "We choose raw materials from the best manufacturers, so our products and decor are of the highest quality at the best prices.",
        },
        {
            id: 3,
            image: Truck,
            topic: "Delivery to your door",
            content:
                "We will deliver to your door anywhere in the world. If you're not 100% satisfied, let us know within 30 days and we'll solve the problem.",
        },
    ];
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 xl:px-14 my-12 gap-12">
                {provides.map((provide) => (
                    <div
                        key={provide.id}
                        className="flex flex-col gap-4 justify-center items-center"
                    >
                        <provide.image
                            size={42}
                            className="text-slate-800 dark:text-slate-200"
                        />
                        <h1 className="text-center font-semibold text-slate-800 dark:text-slate-200 text-xl leading-7">
                            {provide.topic}
                        </h1>
                        <p className="text-center text-sm leading-5 font-normal text-gray-600 dark:text-gray-200">
                            {provide.content}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
export default Provide;
