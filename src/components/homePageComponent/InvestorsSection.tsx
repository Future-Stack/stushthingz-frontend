import CommonWrapper from "@/common/CommonWrapper";
// import investorImage from "@/assets/home/investorSection.png"
import investorImage from "@/assets/home/village-landscape.png"
import { motion, Variants } from "framer-motion";

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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const InvestorsSection = () => {
    return (
        <section className="w-full py-10 md:py-15 lg:py-20 xl:py-25 bg-linear-to-b from-[#fffffff6] to-[#F6F6F6]">
            <CommonWrapper className="grid md:grid-cols-2 gap-12 items-start">

                {/* LEFT SIDE */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-color-jet-black"
                    >
                        Built for Foreign Investors
                    </motion.h2>

                    <div className="space-y-5">
                        {features.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-color-jet-black group-hover:text-pink-600 transition mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm md:text-base text-[#4A5565] leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative"
                >
                    <img
                        src={investorImage}
                        alt="Luxury Property"
                        className="w-full h-105 object-cover rounded-2xl shadow-xl"
                    />
                </motion.div>

            </CommonWrapper>
        </section>
    );
};

export default InvestorsSection;