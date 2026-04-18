interface TestimonialCardProps {
    name: string;
    role: string;
    location: string;
    text: string;
    image: string;
}
const TestimonialCard = ({ name, role, location, text, image }: TestimonialCardProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex text-pink-500 mb-3">
                {"★★★★★"}
            </div>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                "{text}"
            </p>

            <div className="flex items-center gap-3">
                <img
                    src={image}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h4 className="text-sm font-semibold">{name}</h4>
                    <p className="text-xs text-gray-500">{role}</p>
                    <p className="text-xs text-gray-400">{location}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;