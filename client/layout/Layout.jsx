import { Outlet } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Navbar from "../components/Navbar";

function Layout() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <main className="relative overflow-hidden">
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      </main>
      {/* Footer */}
    </div>
  );
}

export default Layout;
