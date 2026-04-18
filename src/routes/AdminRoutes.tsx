import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

/**
 * 🛠️ TEMPLATE NOTE:
 * Set BYPASS_AUTH to `true` to allow visiting admin routes without logging in.
 * This is useful for previewing the template. Set it to `false` in production.
 */
const BYPASS_AUTH = true;

const AdminRoute = () => {
  const user = useAppSelector(selectUser);

  if (BYPASS_AUTH) return <Outlet />;

  // Check if the user is logged in and has an admin role
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
