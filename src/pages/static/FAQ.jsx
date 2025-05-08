import Accordion from "../../components/layout/shared/Accordion";

function Faq() {
    const Questions = [
        {
            title: "How long will delivery take?",
            content:
                "Delivery times vary based on your location and the chosen shipping method. Generally, our standard delivery takes up to 5 days, while our Express Delivery ensures your order reaches you within 1 day. Please note that these times may be subject to occasional variations due to unforeseen circumstances, but we do our best to meet these estimates.",
        },
        {
            title: "What payment methods do you accept?",
            content:
                "We offer a range of secure payment options to provide you with flexibility and convenience. Accepted methods include major credit/debit cards, PayPal, and other secure online payment gateways. You can find the complete list of accepted payment methods during the checkout process.",
        },
        {
            title: "Do you ship internationally?",
            content:
                "Yes, we proudly offer international shipping to cater to our global customer base. Shipping costs and delivery times will be automatically calculated at the checkout based on your selected destination. Please note that any customs duties or taxes applicable in your country are the responsibility of the customer.",
        },
        {
            title: "Do I need an account to place an order?",
            content:
                "While you can place an order as a guest, creating an account comes with added benefits. By having an account, you can easily track your orders, manage your preferences, and enjoy a quicker checkout process for future purchases. It also allows us to provide you with personalized recommendations and exclusive offers.",
        },
        {
            title: "How can I track my order?",
            content:
                "Once your order is dispatched, you will receive a confirmation email containing a unique tracking number. You can use this tracking number on our website to monitor the real-time status of your shipment. Additionally, logging into your account will grant you access to a comprehensive order history, including tracking information.",
        },
        {
            title: "What are the product refund conditions?",
            content:
                "Our refund policy is designed to ensure customer satisfaction. Details can be found in our [refund policy page](insert link). In essence, we accept returns within [insert number] days of receiving the product, provided it is in its original condition with all tags and packaging intact. Refunds are processed promptly once the returned item is inspected and approved.",
        },
        {
            title: "Do I need to create an account to shop with you?",
            content:
                "While guest checkout is available for your convenience, creating an account enhances your overall shopping experience. With an account, you can easily track your order status, save multiple shipping addresses, and enjoy a streamlined checkout process. Moreover, account holders receive early access to promotions and exclusive offers. Signing up is quick and hassle-free!",
        },
        {
            title: "Is there a minimum order value for free shipping?",
            content:
                "Yes, we offer free shipping on orders exceeding $250. Orders below this threshold are subject to standard shipping fees, which will be displayed during the checkout process.",
        },
    ];
    return (
        <>
            <div className="py-8 px-8 sm:px-28">
                <h1 className="font-semibold text-slate-900 dark:text-slate-200 text-4xl mb-2 leading-tight text-center mb-12 ">
                    Popular questions
                </h1>
                <Accordion items={Questions} />
            </div>
        </>
    );
}

export default Faq;
