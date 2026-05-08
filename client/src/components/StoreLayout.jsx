import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />
      <main className="flex-grow pt-[104px] md:pt-[124px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
