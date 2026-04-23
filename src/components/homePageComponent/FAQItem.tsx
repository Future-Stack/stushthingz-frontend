// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useState } from "react";

// interface FAQItemProps {
//     question: string;
//     answer: string;
// }

// const FAQItem = ({ question, answer }: FAQItemProps) => {
//     const [open, setOpen] = useState(false);

//     return (
//         <div className="border-b">
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="w-full text-left py-4 flex justify-between items-center"
//             >
//                 <span className="font-medium text-color-jet-black">{question}</span>
//                 <span className="text-[#212B36]">{open ? <ChevronUp /> : <ChevronDown />}</span>
//             </button>

//             {open && (
//                 <p className="text-[#364153] pb-4 text-sm">{answer}</p>
//             )}
//         </div>
//     );
// };

// export default FAQItem;

import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border-b-2 border-b-[#DFE3E8] last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left py-4 flex justify-between items-center cursor-pointer"
            >
                <span className="font-semibold text-color-jet-black text-lg">
                    {question}
                </span>

                <ChevronDown
                    className={`transition-transform duration-300 text-[#212B36] ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: open
                        ? `${contentRef.current?.scrollHeight}px`
                        : "0px",
                    opacity: open ? 1 : 0,
                }}
            >
                <p className="text-[#364153] text-base font-normal pb-4">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default FAQItem;