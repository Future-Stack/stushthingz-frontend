import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/nav/logo.png";

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(179); // 2:59 in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = () => {
    console.log("Verifying OTP:", otp.join(""));
    navigate("/reset-password");
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="w-40 mb-6" />
        <h2 className="text-4xl font-bold text-black mb-1 font-inter">Verify OTP</h2>
        <p className="text-base text-[#454F5B] font-normal leading-relaxed">
          We have sent you a 6 digit OTP code to your provided email{" "}
          <span className="font-bold text-black">example@email.com</span> please input that code here to proceed.
        </p>
      </div>

      <div className="text-center mb-8">
        <span className="text-color-main text-lg font-bold">{formatTime(timer)}</span>
      </div>

      <div className="flex justify-between gap-2 mb-8">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-12 text-center text-lg font-bold bg-[#F3F3F5] border border-dashed border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main"
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <button className="text-base font-medium text-black hover:underline cursor-pointer">
          Resend
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex-1 px-4 py-3 border border-[#344054] rounded-xl text-[#344054] font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleVerify}
          className="flex-1 bg-color-main text-white py-3 rounded-xl font-semibold hover:bg-color-main/90 transition-colors shadow-lg cursor-pointer"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
