import FAQItem from "./FAQItem";

const faqs = [
    {
        question: "Can foreigners buy property in Jamaica?",
        answer:
            "Yes! Jamaica welcomes foreign investment in real estate...",
    },
    {
        question: "How does Vanessa AI help me?",
        answer: "It guides you through property selection and analysis...",
    },
    {
        question: "What are the total costs involved?",
        answer: "Costs include legal fees, taxes, and closing costs...",
    },
    {
        question: "Can I get a mortgage as a foreign buyer?",
        answer: "Yes, but terms may vary depending on lenders...",
    },
];

const FAQSection = () => {
    return (
        <section className="bg-white py-16 px-4 md:px-10">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-color-jet-black">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Everything you need to know about investing in Jamaica
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl shadow p-4 md:p-6">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;