import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

/**
 * 🛠️ TEMPLATE NOTE:
 * Set BYPASS_AUTH to `true` to allow visiting protected routes without logging in.
 * This is useful for previewing the template. Set it to `false` in production.
 */
const BYPASS_AUTH = true;

const PrivateRoute = () => {
    const user = useAppSelector(selectUser);

    if (BYPASS_AUTH) return <Outlet />;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
