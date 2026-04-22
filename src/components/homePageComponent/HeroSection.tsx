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
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}
            <CommonWrapper className="relative z-10 w-full px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT */}
                <div className="text-white space-y-4">
                    <h1 className="text-2xl md:text-[32px] lg:text-[40px] xl:text-[54px] font-bold text-white font-poppins md:leading-10 lg:leading-14 xl:leading-16">
                        Invest in Jamaica Real Estate with Confidence
                    </h1>
                    <p className="text-xl font-normal text-[#F4F6F8] mb-10">
                        AI-guided investment journey designed for foreign buyers
                    </p>
                    <button className="bg-color-main transition px-4 py-2.5 rounded-lg font-semibold shadow-lg">
                        Get Started →
                    </button>
                </div>

                {/* RIGHT — Overlapping collage */}
                <div className="hidden md:flex items-center justify-center mr-3">
                    <div className="relative w-105 h-75 lg:w-125 lg:h-90 xl:w-140 xl:h-100">
                        {/* <div className="relative w-[120%] max-w-[520px] lg:max-w-[620px] xl:max-w-[720px] aspect-[4/3]"> */}



                        {/* IMAGE 1 */}
                        {/* <img
                            src={heroImg1}
                            className="
    absolute z-30
    top-0 right-[3%]
    w-[65%]
    aspect-[6/4] object-cover
    rounded-2xl shadow-2xl
  "
                        /> */}

                        {/* IMAGE 2 */}
                        {/* <img
                            src={heroImg2}
                            className="
    absolute z-20
    top-[40%] left-0
    w-[62%]
    aspect-[9/5] object-cover
    rounded-2xl shadow-2xl
  "
                        /> */}

                        {/* IMAGE 3 */}
                        {/* <img
                            src={heroImg3}
                            className="
    absolute z-40
    bottom-0 -right-[20%]
    w-[55%]
    aspect- object-cover
    rounded-2xl shadow-2xl
  "
                        /> */}

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