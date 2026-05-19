import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollToTop from "../common/ScrollToTop";

const Layout: React.FC = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
