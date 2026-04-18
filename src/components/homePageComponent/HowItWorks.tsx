import CommonWrapper from "@/common/CommonWrapper";
import { FileCheck, MessageSquare, Shield, TrendingUp } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: MessageSquare,
        title: "Tell us about your goals",
        desc: "Share your investment objectives with Vanessa, our AI guide",
    },
    {
        number: "02",
        icon: TrendingUp,
        title: "Assess your readiness",
        desc: "Get a clear picture of your financial position and investment capacity",
    },
    {
        number: "03",
        icon: FileCheck,
        title: "Prepare documents",
        desc: "Upload and organize all required documentation",
    },
    {
        number: "04",
        icon: Shield,
        title: "Get guided to next steps",
        desc: "Receive personalized guidance throughout your journey",
    },
];

const HowItWorks = () => {
    return (
        <section className="w-full py-20 bg-white">
            <CommonWrapper>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-color-jet-black">
                    How It Works
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-xl hover:shadow-lg transition duration-300"
                        >
                            {/* Number */}
                            <h3 className="text-pink-600 text-4xl font-bold mb-4 group-hover:scale-110 transition">
                                {step.number}
                            </h3>

                            {/* Icon placeholder */}
                            <div className="text-pink-500 mb-3">
                                {step.icon && <step.icon className="w-8 h-8" />}
                            </div>

                            {/* Title */}
                            <h4 className="text-lg font-semibold mb-2 text-[#212B36]">
                                {step.title}
                            </h4>

                            {/* Description */}
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default HowItWorks;