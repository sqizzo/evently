import React from "react";

const NavbarMenuButton = ({ icon, link, text, selected }) => {
  return (
    <a
      href={link}
      className={`leading-relaxed flex gap-2 items-center px-3 py-2 rounded-md hover:bg-blue-200/45  border-2 border-transparent hover:border-blue-400/70 hover:border-2 hover:text-blue-500 transition-all ${
        selected ? "border-blue-400/70 text-blue-500 bg-blue-200/45" : ""
      }`}
    >
      {icon}
      <span className="pl-4 md:pl-0">{text}</span>
    </a>
  );
};

export default NavbarMenuButton;
