// import React from "react";
// import { Link } from "react-router-dom";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
// import { Mail } from "lucide-react";

// const footerLinks = {
//   "Company": [
//     { label: "About Us", to: "/about" },
//     { label: "Services", to: "/services" },
//     { label: "Contact", to: "/contact" },
//   ],
//   "Legal": [
//     { label: "Privacy Policy", to: "#" },
//     { label: "Terms of Service", to: "#" },
//     { label: "Cookie Policy", to: "#" },
//   ],
//   "Account": [
//     { label: "Login", to: "/login" },
//     { label: "Sign Up", to: "/signup" },
//     { label: "Dashboard", to: "/dashboard" },
//   ],
// };

// const socialLinks = [
//   { href: "https://facebook.com", icon: FaFacebook, label: "Facebook" },
//   { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
//   { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
//   { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
//   { href: "https://github.com", icon: FaGithub, label: "GitHub" },
// ];

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-[#212a31] text-white">
//       {/* Top gradient divider */}
//       <div className="h-px bg-gradient-to-r from-transparent via-[#124e66] to-transparent" />

//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
//           {/* Brand Column */}
//           <div className="col-span-2 space-y-4">
//             <Link to="/" className="flex items-center gap-2 group w-fit">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center font-bold text-sm shadow-lg">
//                 M
//               </div>
//               <span className="text-lg font-bold">
//                 My<span className="text-[#748d92]">App</span>
//               </span>
//             </Link>
//             <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
//               A modern full-stack React TypeScript template with Redux Toolkit, RTK Query, authentication, and a beautiful dashboard — ready to customize.
//             </p>
//             {/* Social Icons */}
//             <div className="flex items-center gap-3 pt-1">
//               {socialLinks.map(({ href, icon: Icon, label }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={label}
//                   className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#124e66] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
//                 >
//                   <Icon size={15} />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Link Columns */}
//           {Object.entries(footerLinks).map(([heading, links]) => (
//             <div key={heading}>
//               <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
//                 {heading}
//               </h3>
//               <ul className="space-y-2.5">
//                 {links.map(({ label, to }) => (
//                   <li key={label}>
//                     <Link
//                       to={to}
//                       className="text-sm text-gray-400 hover:text-white transition-colors"
//                     >
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Newsletter */}
//         <div className="mt-10 pt-8 border-t border-white/5">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//             <div>
//               <h3 className="text-sm font-semibold text-white mb-1">Stay updated</h3>
//               <p className="text-xs text-gray-400">Get the latest updates delivered to your inbox.</p>
//             </div>
//             <form
//               className="flex w-full md:w-auto"
//               onSubmit={(e) => e.preventDefault()}
//             >
//               <div className="flex w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#748d92]/50 transition-colors">
//                 <div className="flex items-center px-3 text-gray-400 shrink-0">
//                   <Mail size={16} />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none py-2.5 pr-3 w-full sm:w-56"
//                 />
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white text-sm font-medium hover:opacity-90 transition-opacity border-l border-white/10"
//                 >
//                   Subscribe
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <p className="text-xs text-gray-500">
//             © {new Date().getFullYear()} MyApp. All rights reserved.
//           </p>
//           <p className="text-xs text-gray-600">
//             Built with React + TypeScript + Redux Toolkit
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Left */}
        <div>
          <h2 className="text-pink-500 text-xl font-bold mb-3">
            Vanessa
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            The complete platform for digitizing investment journeys.
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
    </footer>
  );
};

export default Footer;