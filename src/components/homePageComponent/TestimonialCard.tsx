import { Star } from "lucide-react";

interface TestimonialCardProps {
    name: string;
    role: string;
    location: string;
    text: string;
    image: string;
}
const TestimonialCard = ({ name, role, location, text, image }: TestimonialCardProps) => {
    return (
        <div className="flex flex-col justify-between bg-white rounded-2xl shadow-lg border border-[#F3F4F6] p-5 md:p-8 hover:shadow-xl transition">
            <div>
                <div className="flex text-pink-500 mb-3 space-x-1">
                    {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-current" />
                    ))}
                </div>

                <p className="text-[#454F5B] text-base font-normal mb-6 leading-relaxed italic">
                    "{text}"
                </p>
            </div>

            <div className="flex items-center gap-3">
                <img
                    src={image}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h4 className="text-base text-color-jet-black font-semibold mb-0.5">{name}</h4>
                    <p className="text-sm font-normal text-[#4A5565]">{role}</p>
                    <p className="text-sm font-normal text-[#718096]">{location}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;