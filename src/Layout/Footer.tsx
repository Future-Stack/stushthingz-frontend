import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import CommonWrapper from "@/common/CommonWrapper";
import logo from "@/assets/nav/logo.png"

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6">
      <CommonWrapper>
        <div className="md:flex items-center justify-between gap-10">

          {/* Left */}
          <div>
            <img src={logo} alt="" className="mb-6"/>
            <p className="text-sm text-gray-400 mb-4">
              The complete platform for digitizing Investment journey inspections and operations. Simple, fast, and reliable.
            </p>

            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <Icon size={14} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm">Military House, 24 Castle Street</p>
            <p className="text-sm">Chester CH1 2DS</p>
            <p className="text-sm mt-2">0161 919 6650</p>
            <p className="text-sm">info@oakreef...</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-4 text-sm flex flex-col md:flex-row justify-between">
          <p>© 2025 Vanessa. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="cursor-pointer hover:text-white">Terms</span>
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
          </div>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;