import CommonWrapper from "@/common/CommonWrapper";
import { FileCheck, MessageSquare, Shield, TrendingUp } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const HowItWorks = () => {
    return (
        <section className="w-full py-10 md:py-15 lg:py-20 xl:py-25 bg-white">
            <CommonWrapper>

                {/* Title */}
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-color-jet-black"
                >
                    How It Works
                </motion.h2>

                {/* Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group p-4 rounded-xl hover:shadow-lg transition duration-300"
                        >
                            {/* Number */}
                            <h3 className="text-pink-600 text-5xl font-bold mb-4 group-hover:scale-110 transition">
                                {step.number}
                            </h3>

                            {/* Icon placeholder */}
                            <div className="text-pink-500 mb-3">
                                {step.icon && <step.icon className="w-8 h-8" />}
                            </div>

                            {/* Title */}
                            <h4 className="text-xl font-bold mb-3 text-[#212B36]">
                                {step.title}
                            </h4>

                            {/* Description */}
                            <p className="text-[#454F5B] text-base leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </CommonWrapper>
        </section>
    );
};

export default HowItWorks;