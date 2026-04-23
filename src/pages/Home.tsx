import React from "react";
import HeroSection from "@/components/homePageComponent/HeroSection";
import HowItWorks from "@/components/homePageComponent/HowItWorks";
import InvestorsSection from "@/components/homePageComponent/InvestorsSection";
import TestimonialsSection from "@/components/homePageComponent/TestimonialsSection";
import FAQSection from "@/components/homePageComponent/FAQSection";
import StartJourney from "@/components/homePageComponent/StartJourney";

const Home: React.FC = () => {
  return (
    <div className="bg-[#0f1117] text-white min-h-screen">
      <HeroSection />
      <HowItWorks />
      <InvestorsSection />
      <TestimonialsSection />
      <FAQSection />
      <StartJourney />
    </div>
  );
};

export default Home;
