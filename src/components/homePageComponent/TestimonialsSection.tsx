import CommonWrapper from "@/common/CommonWrapper";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Vacation Home Owner",
        location: "Toronto, Canada",
        text: "Vanessa made buying my dream villa incredibly simple...",
        image: "https://i.pravatar.cc/100?img=1",
    },
    {
        name: "Michael Chen",
        role: "Investment Property Owner",
        location: "New York, USA",
        text: "As a first-time foreign investor, I was nervous...",
        image: "https://i.pravatar.cc/100?img=2",
    },
    {
        name: "Emma Williams",
        role: "Rental Property Investor",
        location: "London, UK",
        text: "The platform's clear breakdown of costs saved me...",
        image: "https://i.pravatar.cc/100?img=3",
    },
];

const TestimonialsSection = () => {
    return (
        <section className="bg-gray-50 py-16 px-4 md:px-10">
            <CommonWrapper>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-color-jet-black">
                        What Our Investors Say
                    </h2>
                    <p className="text-[#454F5B] mt-2">
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