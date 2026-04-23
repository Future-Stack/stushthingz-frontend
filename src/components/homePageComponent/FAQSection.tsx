import CommonWrapper from "@/common/CommonWrapper";
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
        <section className="w-full py-10 md:py-15 lg:py-20 xl:py-25 bg-linear-to-b from-[#fffffff6] to-[#F6F6F6]">
            <CommonWrapper className="lg:px-44">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-color-jet-black">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg md:text-xl text-[#454F5B] mt-2">
                        Everything you need to know about investing in Jamaica
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-lg p-4 md:p-8">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default FAQSection;