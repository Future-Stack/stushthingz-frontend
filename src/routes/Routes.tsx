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
import Services from "@/pages/Services";
import AdminLayout from "@/Layout/AdminLayout";
import UserLayout from "@/Layout/UserLayout";

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
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
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
