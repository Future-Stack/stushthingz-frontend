import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import AdminRoute from "./AdminRoutes";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminSettings from "@/pages/Admin/AdminSettings";
import UserDashboard from "@/pages/User/UserDashboard";
import UserProfile from "@/pages/User/UserProfile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import ResetPassword from "@/pages/ResetPassword";
import Services from "@/pages/Services";
import AdminLayout from "@/Layout/AdminLayout";
import UserLayout from "@/Layout/UserLayout";
import InvestorLayout from "@/Layout/InvestorLayout";
import AuthLayout from "@/Layout/AuthLayout";
import InvestorDashboard from "@/pages/Investor/InvestorDashboard";
import PropertyListing from "@/pages/Investor/PropertyListing";
import Onboarding from "@/pages/Onboarding";
import FinancialAssessment from "@/pages/FinancialAssessment";
import InvestmentGuide from "@/pages/InvestmentGuide";
import DocumentChecklist from "@/pages/DocumentChecklist";

const routes = createBrowserRouter([
  {
    // ─── Public Layout (Navbar + Footer) ───────────────────────────────────────
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/services", element: <Services /> },
    ],
  },

  {
    // ─── Auth Layout (Split Screen) ──────────────────────────────────────────
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-otp", element: <VerifyOTP /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },

  {
    // ─── Standalone Onboarding (No Navbar/Footer) ──────────────────────────────
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/onboarding/assessment",
    element: <FinancialAssessment />,
  },
  {
    path: "/onboarding/guide",
    element: <InvestmentGuide />,
  },
  {
    path: "/onboarding/documents",
    element: <DocumentChecklist />,
  },

  {
    // ─── User Dashboard (requires login — see PrivateRoute for BYPASS_AUTH) ───
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "", element: <UserDashboard /> },
          { path: "profile", element: <UserProfile /> },
          // 🛠️ Add more user pages here
        ],
      },
    ],
  },

  {
    // ─── Investor Dashboard (requires login — see PrivateRoute for BYPASS_AUTH) ───
    path: "/investor",
    element: <PrivateRoute />,
    children: [
      {
        element: <InvestorLayout />,
        children: [
          { path: "dashboard", element: <InvestorDashboard /> },
          { path: "opportunities", element: <PropertyListing /> },
          // 🛠️ Add more investor pages here
        ],
      },
    ],
  },

  {
    // ─── Admin Dashboard (requires admin role — see AdminRoutes for BYPASS_AUTH)
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "settings", element: <AdminSettings /> },
          // 🛠️ Add more admin pages here
        ],
      },
    ],
  },

  {
    // ─── 404 ───────────────────────────────────────────────────────────────────
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
