import heroBg from "@/assets/home/heroBg.png"
import heroImg1 from "@/assets/home/heroImg1.png"
import heroImg2 from "@/assets/home/heroImg2.png"
import heroImg3 from "@/assets/home/heroImg3.png"
import CommonWrapper from "@/common/CommonWrapper"

export default function HeroSection() {
    return (
        <section className="relative w-full h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroBg}
                    alt="Jamaica"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <CommonWrapper className="relative z-10 w-full px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT */}
                <div className="text-white space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Invest in Jamaica Real Estate with Confidence
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md">
                        AI-guided investment journey designed for foreign buyers
                    </p>
                    <button className="bg-pink-500 hover:bg-pink-600 transition px-6 py-3 rounded-full font-semibold shadow-lg">
                        Get Started →
                    </button>
                </div>

                {/* RIGHT — Overlapping collage */}
                <div className="hidden md:flex items-center justify-center">
                    {/*
                        Wrapper: fixed intrinsic size so absolute children
                        have a reliable coordinate system, then scaled down
                        on smaller viewports with clamp / responsive classes.
                    */}
                    <div className="relative w-105 h-75 lg:w-125 lg:h-90 xl:w-140 xl:h-100">

                        {/*
                            IMAGE 1 — top-right, smallest, sits on top (z-30)
                            In the screenshot: ~38% wide, anchored top-right
                        */}
                        <img
                            src={heroImg1}
                            alt="Property 1"
                            className="
                                absolute z-30
                                top-0 right-[20%]
                                w-[58%]
                                aspect-6/4 object-cover
                                rounded-2xl
                                shadow-2xl
                            "
                        />

                        {/*
                            IMAGE 2 — center, largest, sits in the middle (z-20)
                            In the screenshot: ~54% wide, vertically centred,
                            shifted left so it overlaps behind img3
                        */}
                        <img
                            src={heroImg2}
                            alt="Property 2"
                            className="
                                absolute z-20
                                top-[40%] left-0
                                w-[56%]
                                aspect-9/5 object-cover
                                rounded-2xl
                                shadow-2xl
                            "
                        />

                        {/*
                            IMAGE 3 — bottom-right, medium, sits at the back (z-10)
                            In the screenshot: ~46% wide, bottom-right corner,
                            slightly behind image 2
                        */}
                        <img
                            src={heroImg3}
                            alt="Property 3"
                            className="
                                absolute z-35
                                bottom-0 -right-[7%]
                                w-[48%]
                                aspect- object-cover
                                rounded-2xl
                                shadow-2xl
                            "
                        />
                    </div>
                </div>

            </CommonWrapper>
        </section>
    )
}