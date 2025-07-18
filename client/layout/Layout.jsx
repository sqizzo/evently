import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
    </div>
  );
}

export default Layout;
