import React from "react";
import UpcomingCarousel from "./UpcomingCarousel";

function UpcomingSection() {
  return (
    <section className="flex px-28 flex-col justify-center mb-20 text-gray-900 border-t-2 border-t-gray-300/20 w-full">
      {/* Section title */}
      <div className="flex flex-col pt-14 pb-8 gap-4 text-center ">
        <h2 className="text-4xl font-extrabold">Upcoming Events</h2>
        <p className="">Stay informed and never miss an event near you.</p>
      </div>
      {/* Carousel */}
      <div className="flex justify-center">
        <div className="w-full md:w-10/12">
          <UpcomingCarousel />
        </div>
      </div>
    </section>
  );
}

export default UpcomingSection;
