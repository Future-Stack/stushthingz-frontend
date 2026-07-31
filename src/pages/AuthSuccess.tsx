import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import { useLazyGetMeQuery } from "@/store/features/auth/auth.api";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setErrorMsg("Authentication token missing. Please try logging in again.");
        return;
      }

      try {
        // 1. Store token in Redux state first so getMe query carries Authorization header
        dispatch(setUser({ accessToken: token }));

        // 2. Fetch logged-in user profile
        const meRes = await getMe().unwrap();
        const user = meRes?.data;

        // 3. Update Redux store with full user object and token (persisted)
        dispatch(setUser({ user, accessToken: token }));

        // 4. Check if new user or onboarding incomplete
        const isNewUser = searchParams.get("isNewUser") === "true";
        const isCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";

        if (isNewUser || (!isCompletedOnboarding && user?.role === "user")) {
          navigate("/onboarding");
        } else if (user?.role === "admin") {
          navigate("/admin");
        } else if (user?.role === "user") {
          navigate("/investor/dashboard");
        } else if (user?.role === "bank_operator") {
          navigate("/bank");
        } else {
          navigate("/investor/dashboard");
        }
      } catch (err: unknown) {
        console.error("Google authentication callback error:", err);
        setErrorMsg("Failed to verify Google login session. Please try again.");
      }
    };

    handleGoogleAuthCallback();
  }, [searchParams, dispatch, getMe, navigate]);

  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-gray-50 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-color-main text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-gray-200">
        <div className="w-12 h-12 border-4 border-color-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Completing Google Sign-in</h2>
        <p className="text-gray-500 text-sm">Please wait while we verify your credentials...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
