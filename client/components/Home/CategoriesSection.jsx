import React from "react";
import CategoriesButton from "./CategoriesButton";

function CategoriesSection() {
  const categories = [
    {
      name: "Seminar",
      color: "bg-blue-300/40 text-blue-800",
      icon: "🏫",
      link: "/events?category=seminar",
    },
    {
      name: "Workshop",
      color: "bg-yellow-300/40 text-yellow-800",
      icon: "🛠️",
      link: "/events?category=workshop",
    },
    {
      name: "Webinar",
      color: "bg-green-300/40 text-green-800",
      icon: "🧑‍💻",
      link: "/events?category=webinar",
    },
    {
      name: "Concert",
      color: "bg-purple-300/40 text-purple-800",
      icon: "🎤",
      link: "/events?category=concert",
    },
    {
      name: "Festival",
      color: "bg-violet-300/40 text-violet-800",
      icon: "🎉",
      link: "/events?category=festival",
    },
    {
      name: "Conference",
      color: "bg-cyan-300/40 text-cyan-800",
      icon: "🏢",
      link: "/events?category=conference",
    },
    {
      name: "Competition",
      color: "bg-amber-300/40 text-amber-800",
      icon: "🥇",
      link: "/events?category=competition",
    },
    {
      name: "Meetup",
      color: "bg-indigo-300/40 text-indigo-800",
      icon: "👋",
      link: "/events?category=meetup",
    },
    {
      name: "Sports",
      color: "bg-lime-300/40 text-lime-800",
      icon: "🎾",
      link: "/events?category=sports",
    },
    {
      name: "Exhibition",
      color: "bg-sky-300/40 text-sky-800",
      icon: "🎨",
      link: "/events?category=exhibition",
    },
    {
      name: "Charity",
      color: "bg-fuchsia-300/40 text-fuchsia-800",
      icon: "💸",
      link: "/events?category=charity",
    },
    {
      name: "Others",
      color: "bg-slate-300/40 text-slate-800",
      icon: "👀",
      link: "/events?category=others",
    },
  ];

  return (
    <section className="flex px-28 flex-col justify-center mb-20 text-gray-900 border-t-2 border-t-gray-300/20 w-full">
      {/* Section title */}
      <div className="flex flex-col pt-14 pb-8 gap-4 text-center ">
        <h2 className="text-4xl font-extrabold">Explore your Interest!</h2>
        <p className="">From music to tech, we’ve got events you’ll love.</p>
      </div>
      {/* Categories */}
      <div className="flex justify-center">
        <div className="w-6/7 lg:w-1/2 flex flex-wrap gap-x-4 gap-y-4 justify-center pt-8">
          {categories.map((e) => {
            return (
              <CategoriesButton
                key={e.name}
                link={e.link}
                name={e.name}
                color={e.color}
                icon={e.icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
