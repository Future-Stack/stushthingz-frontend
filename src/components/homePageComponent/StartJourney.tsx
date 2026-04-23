
import watermark from "@/assets/home/watermark.png"
import CommonWrapper from "@/common/CommonWrapper"

export default function StartJourney() {
    return (
        <section className="relative overflow-hidden text-white bg-[linear-gradient(135deg,#D91A7C_0%,#D51A7A_10%,#D11977_20%,#CD1975_30%,#C81873_40%,#C41870_50%,#C0176E_60%,#BC176C_70%,#B8166A_80%,#B41667_90%,#B01565_100%)]">
            <CommonWrapper className="py-8">

                {/* Left Watermark */}
                <img
                    src={watermark}
                    alt="left shape"
                    className="hidden lg:block absolute md:left-40 top-1/2 -translate-y-1/2 opacity-10 w-32 md:w-40 pointer-events-none"
                />

                {/* Right Watermark */}
                <img
                    src={watermark}
                    alt="right shape"
                    className="hidden lg:block absolute lg:right-40 top-1/3 -translate-y-1/2 opacity-10 w-32 md:w-20 pointer-events-none -rotate-180"
                />

                <div className="px-6 py-16 text-center">

                    <h1 className="text-3xl md:text-5xl font-bold mb-7">
                        Start Your Investment Journey
                    </h1>

                    <p className="text-sm md:text-xl font-normal text-[#FFFFFFE5] mb-6">
                        Join foreign investors who trust Vanessa to navigate Jamaica&apos;s real estate market
                    </p>

                    <button className="bg-white text-lg text-pink-700 font-medium px-6 py-3 rounded-lg shadow hover:bg-pink-100 transition">
                        Get Started Now →
                    </button>
                </div>
            </CommonWrapper>
        </section>
    )
}
