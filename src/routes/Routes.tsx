import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import AdminRoute from "./AdminRoutes";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminSettings from "@/pages/Admin/AdminSettings";
import AdminLayout from "@/Layout/AdminLayout";
import InvestorLayout from "@/Layout/InvestorLayout";
import AuthLayout from "@/Layout/AuthLayout";
import InvestorDashboard from "@/pages/Investor/InvestorDashboard";
import PropertyListing from "@/pages/Investor/PropertyListing";
import PropertyDetails from "@/pages/Investor/PropertyDetails";
import ExpressInterest from "@/pages/Investor/ExpressInterest";
import Onboarding from "@/pages/Onboarding";
import FinancialAssessment from "@/pages/FinancialAssessment";
import InvestmentGuide from "@/pages/InvestmentGuide";
import DocumentChecklist from "@/pages/DocumentChecklist";
import BankLayout from "@/Layout/BankLayout";
import BankDashboard from "@/pages/Bank/BankDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import ResetPassword from "@/pages/ResetPassword";

const routes = createBrowserRouter([
  {
    // ─── Public Layout (Navbar + Footer) ───────────────────────────────────────
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> }
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
    // ─── Investor Dashboard (requires login — see PrivateRoute for BYPASS_AUTH) ───
    path: "/investor",
    element: <PrivateRoute />,
    children: [
      {
        element: <InvestorLayout />,
        children: [
          { path: "dashboard", element: <InvestorDashboard /> },
          { path: "opportunities", element: <PropertyListing /> },
          { path: "opportunities/:id", element: <PropertyDetails /> },
          { path: "interest", element: <ExpressInterest /> },
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
    // ─── Bank Portal Dashboard
    path: "/bank",
    element: <BankLayout />,
    children: [
      { path: "", element: <BankDashboard /> },
    ],
  },

  {
    // ─── 404 ───────────────────────────────────────────────────────────────────
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
