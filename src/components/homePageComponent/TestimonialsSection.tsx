import CommonWrapper from "@/common/CommonWrapper";
import TestimonialCard from "./TestimonialCard";
import { motion, Variants } from "framer-motion";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Vacation Home Owner",
        location: "Toronto, Canada",
        text: "Vanessa made buying my dream villa in Montego Bay incredibly simple. The AI guidance helped me understand every step, and the document checklist kept me organized.",
        image: "https://i.pravatar.cc/100?img=1",
    },
    {
        name: "Michael Chen",
        role: "Investment Property Owner",
        location: "New York, USA",
        text: "As a first-time foreign investor, I was nervous about the process. Vanessa's financial assessment gave me confidence, and the investment guide was invaluable.",
        image: "https://i.pravatar.cc/100?img=2",
    },
    {
        name: "Emma Williams",
        role: "Rental Property Investor",
        location: "London, UK",
        text: "The platform's clear breakdown of costs and taxes saved me from surprises. My investment is now generating steady rental income. Highly recommend!",
        image: "https://i.pravatar.cc/100?img=3",
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const TestimonialsSection = () => {
    return (
        <section className="bg-white py-10 md:py-15 lg:py-20 xl:py-25">
            <CommonWrapper>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-14"
                >
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-5 text-color-jet-black">
                        What Our Investors Say
                    </h2>
                    <p className="text-lg md:text-xl text-[#454F5B] mt-2">
                        Join hundreds of satisfied investors who trust Vanessa
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {testimonials.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <TestimonialCard {...item} />
                        </motion.div>
                    ))}
                </motion.div>
            </CommonWrapper>
        </section>
    );
};

export default TestimonialsSection;