import CommonWrapper from "@/common/CommonWrapper";
import TestimonialCard from "./TestimonialCard";

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

const TestimonialsSection = () => {
    return (
        <section className="bg-white py-10 md:py-15 lg:py-20 xl:py-25">
            <CommonWrapper>
                <div className="text-center mb-14">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-5 text-color-jet-black">
                        What Our Investors Say
                    </h2>
                    <p className="text-lg md:text-xl text-[#454F5B] mt-2">
                        Join hundreds of satisfied investors who trust Vanessa
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default TestimonialsSection;