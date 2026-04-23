import CommonWrapper from "@/common/CommonWrapper";
import investorImage from "@/assets/home/investorSection.png"

const features = [
    {
        title: "AI-Powered Guidance",
        desc: "Vanessa AI understands the complexities of cross-border investment",
    },
    {
        title: "Structured Process",
        desc: "Clear, step-by-step journey from assessment to documentation",
    },
    {
        title: "Financial Clarity",
        desc: "Understand costs, taxes, and financing options upfront",
    },
    {
        title: "Document Readiness",
        desc: "Never miss a required document or deadline",
    },
];

const InvestorsSection = () => {
    return (
        <section className="w-full py-10 md:py-15 lg:py-20 xl:py-25 bg-linear-to-b from-[#fffffff6] to-[#F6F6F6]">
            <CommonWrapper className="grid md:grid-cols-2 gap-12 items-start">

                {/* LEFT SIDE */}
                <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-color-jet-black">
                        Built for Foreign Investors
                    </h2>

                    <div className="space-y-5">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="group"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-color-jet-black group-hover:text-pink-600 transition mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm md:text-base text-[#4A5565] leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="relative">
                    <img
                        src={investorImage}
                        alt="Luxury Property"
                        className="w-full h-105 object-cover rounded-2xl shadow-xl"
                    />
                </div>

            </CommonWrapper>
        </section>
    );
};

export default InvestorsSection;