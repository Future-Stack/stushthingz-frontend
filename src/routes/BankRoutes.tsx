import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

const BYPASS_AUTH = false;

const BankRoute = () => {
  const user = useAppSelector(selectUser);

  if (BYPASS_AUTH) return <Outlet />;

  // Check if the user is logged in and has a bank_operator or admin role
  if (!user || (user.role !== "bank_operator" && user.role !== "bank" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default BankRoute;
