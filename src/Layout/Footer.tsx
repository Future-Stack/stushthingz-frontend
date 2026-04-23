import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import CommonWrapper from "@/common/CommonWrapper";
import logo from "@/assets/nav/logo.png"
import { Mail, MapPin, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#03010E] text-gray-300 py-7 px-6">
      <CommonWrapper>
        <div className="md:flex items-center justify-between gap-10">

          {/* Left */}
          <div>
            <img src={logo} alt="" className="w-48" />
            <p className="text-sm text-white my-6">
              The complete platform for digitizing Investment journey inspections and operations. Simple, fast, and reliable.
            </p>

            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#1E2939] rounded-[10px] hover:bg-[#1E2939] cursor-pointer"
                  >
                    <Icon size={20} className="text-[#D1D5DC]" />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right */}
          <div>
            <h3 className="text-white font-bold text-2xl font-poppins mb-4 mt-6 md:mt-0">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-6 h-6 shrink-0" />
                <p className="text-base text-[#F9FAFB]">Military House 24 Castle Street Chester CH1 2DS</p>
              </div>
              <div className="flex items-start gap-3.5">
                <Smartphone className="w-6 h-6 shrink-0" />
                <p className="text-base text-[#F9FAFB]">0161 919 6650</p>
              </div>
              <div className="flex items-start gap-3.5">
                <Mail className="w-6 h-6 shrink-0" />
                <p className="text-base text-[#F9FAFB]">info@oakreef...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D2D2D2CC] mt-10 pt-7 text-sm flex flex-col md:flex-row justify-between">
          <p className="text-sm font-normal text-[#F9FAFB]">© 2025 Vanessa. All rights reserved.</p>
          <div className="flex gap-4 text-[#F9FAFB] text-sm font-normal mt-3 md:mt-0">
            <span className="cursor-pointer hover:text-white">Terms</span>
            <span className="hover:text-white">|</span>
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
          </div>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;