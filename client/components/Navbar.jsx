import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

// Components
import {
  CalendarHeart,
  House,
  Compass,
  Newspaper,
  Menu,
  X,
} from "lucide-react";
import NavbarMenuButton from "./NavbarMenuButton";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <nav
        className={`w-full p-4 ${
          isMenuOpen ? "" : "shadow-sm"
        } md:shadow-sm flex items-center justify-between z-110 bg-white fixed transition-all text-gray-900`}
      >
        {/* Logo */}
        <a
          href="/"
          className="p-2 mr-4 rounded-md text-xl text-center font-extrabold hover:bg-gray-300/20 transition-all"
        >
          <div className="flex gap-2 align-middle">
            <CalendarHeart size={28} /> <span>Evently</span>
          </div>
        </a>
        {/* Center Menu */}
        <div className="text-sm font-semibold gap-2 hidden md:flex w-110 justify-between">
          <NavbarMenuButton
            icon={<House className="size-4" />}
            link="/"
            text="Home"
            selected={currentPath === "/"}
          />
          <NavbarMenuButton
            icon={<Compass className="size-4" />}
            link="/events"
            text="Browse"
            selected={currentPath === "/events"}
          />
          <NavbarMenuButton
            icon={<Newspaper className="size-4" />}
            link="/news"
            text="News"
            selected={currentPath === "/news"}
          />
        </div>
        {/* Login Button */}
        <div className="hidden md:flex gap-4 md:ml-4">
          <a
            href="/login"
            className="leading-relaxed px-4 py-1 text-sm text-blue-400 font-bold border-2 border-blue-400/70 rounded-md hover:bg-blue-500/80 hover:text-white transition-all"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-4 py-2 text-sm font-bold bg-gradient-to-tl from-blue-500 to-blue-800 rounded-md text-white hover:brightness-120 transition-all"
          >
            Register
          </a>
        </div>
        {/* Menu Button */}
        <button
          className="flex md:hidden "
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key={"close"}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="size-5 font-bold cursor-pointer" />
              </motion.div>
            ) : (
              <motion.div
                key={"menu"}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="size-5 font-bold cursor-pointer" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>
      {/* Extended Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="navbar"
            className="top-[76px] fixed w-full z-150"
            initial={{ y: -75, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "tween" }}
          >
            <div className="flex flex-col px-4 py-6 gap-4 md:hidden text-sm font-semibold shadow-sm transition-all w-full bg-white z-40 pt-2">
              <NavbarMenuButton
                icon={<House className="size-4" />}
                link="/"
                text="Home"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                selected={currentPath === "/"}
              />
              <NavbarMenuButton
                icon={<Compass className="size-4" />}
                link="/events"
                text="Browse"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                selected={currentPath === "/events"}
              />
              <NavbarMenuButton
                icon={<Newspaper className="size-4" />}
                link="/news"
                text="News"
                selected={currentPath === "/news"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              <div className="pt-6 border-t-2 border-t-gray-200/60 text-center flex flex-col-reverse">
                <a
                  href="/login"
                  className="leading-relaxed mt-4 px-4 py-2 text-sm text-blue-400 font-bold  border-2 border-blue-400/70 rounded-md hover:bg-blue-500/80 hover:text-white transition-all"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 leading-relaxed text-sm font-bold bg-gradient-to-tl from-blue-500 to-blue-800 rounded-md text-white hover:brightness-120 transition-all"
                >
                  Register
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
