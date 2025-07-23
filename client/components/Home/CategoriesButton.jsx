import React from "react";

function CategoriesButton({ link, color, icon, name }) {
  return (
    <a
      href={`${link}`}
      className={`py-2 pl-2 pr-4 ${color} rounded-full w-fit hover:brightness-110 hover:-translate-y-2 transition-all cursor-pointer`}
    >
      <span className="mr-2 p-1  rounded-full bg-white ">{icon}</span>{" "}
      <span className="text-md font-semibold">{name}</span>
    </a>
  );
}

export default CategoriesButton;
