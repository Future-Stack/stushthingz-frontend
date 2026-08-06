import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import {
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
} from "@/store/features/auth/auth.api";
import logo from "@/assets/nav/logo.png";

/**
 * VerifyOTP is used for register-OTP verification only.
 * It expects location state: { email: string; mode: "register" }
 * passed from the Signup page.
 */
const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // const [timer, setTimer] = useState(179); // 2:59 in seconds
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // email passed from Signup page via location state
  const email: string = (location.state as { email?: string })?.email ?? "";

  const [verifyRegisterOtp, { isLoading: isVerifying }] = useVerifyRegisterOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendRegisterOtpMutation();

  // useEffect(() => {
  //   inputRefs.current[0]?.focus();
  // }, []);

  // useEffect(() => {
  //   if (timer === 0) return;
  //   const interval = setInterval(() => {
  //     setTimer((prev) => (prev > 0 ? prev - 1 : 0));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [timer]);

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const char = value.substring(value.length - 1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    if (char !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "Enter") {
      handleVerify();
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOtp(pasteData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    setServerError(null);
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setServerError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const res = await verifyRegisterOtp({ email, otp: otpCode }).unwrap();
      const { accessToken, result } = res.data;

      // Build a minimal user object from the register OTP response
      dispatch(
        setUser({
          accessToken,
          user: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
            phone: null,
            profileImage: null,
            countryOfResidence: null,
            investmentBudget: null,
            investmentGoal: null,
            investmentTimeline: null,
            lastPasswordChangeTime: null,
            registrationTime: new Date().toISOString(),
            isVerified: true,
            status: "active",
            provider: "custom",
            image: null,
          },
        })
      );

      // Redirect based on role
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "bank") navigate("/bank");
      else if (result.role === "user") navigate("/onboarding/guide");
      else navigate("/investor/dashboard");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message ?? "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setServerError(null);
    setSuccessMsg(null);
    try {
      await resendOtp({ email }).unwrap();
      setSuccessMsg("OTP resent successfully. Check your email.");
      // setTimer(179);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message ?? "Failed to resend OTP.");
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="mb-6" />
        <h2 className="mb-1 font-inter font-bold text-black text-4xl">Verify OTP</h2>
        <p className="font-normal text-[#454F5B] text-base leading-relaxed">
          We have sent you a 6 digit OTP code to your provided email{" "}
          {email && <span className="font-bold text-black">{email}</span>}. Please input that code here to proceed.
        </p>
      </div>

      {/* <div className="mb-8 text-center">
        <span className="font-bold text-color-main text-lg">{formatTime(timer)}</span>
      </div> */}

      <div className="justify-items-center gap-4 grid grid-cols-3 md:grid-cols-6 mb-8">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className="bg-[#F3F3F5] border border-color-main border-dashed rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main w-12 h-12 font-bold text-lg text-center"
          />
        ))}
      </div>

      {serverError && (
        <p className="mb-4 text-red-500 text-sm text-center">{serverError}</p>
      )}
      {successMsg && (
        <p className="mb-4 text-green-600 text-sm text-center">{successMsg}</p>
      )}

      <div className="mb-8 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="disabled:opacity-40 font-medium text-black text-base hover:underline cursor-pointer disabled:cursor-not-allowed"
        >
          {isResending ? "Resending..." : "Resend"}
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex-1 hover:bg-gray-50 px-4 py-3 border border-[#344054] rounded-xl font-semibold text-[#344054] text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="flex-1 bg-color-main hover:bg-color-main/90 disabled:opacity-60 shadow-lg py-3 rounded-xl font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
