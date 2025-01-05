import { Outlet } from "react-router-dom";
// import { NavBar } from "./NavBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import Footer from "./Footer";

export const Layout = () => {
  return (
    <div className="max-w-[1360px]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
