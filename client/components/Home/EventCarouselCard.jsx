// Library
import React from "react";

// Components
import { ArrowDownRight, MapPin, Wallet } from "lucide-react";
import placeholder from "../../src/assets/placholder_1.jpg";

function EventCarouselCard({
  title,
  description,
  link,
  ticketPrice,
  location,
  bannerUrl,
  category,
  startDate,
}) {
  const categoryColor = {
    seminar: "bg-blue-300/40 text-blue-800",
    workshop: "bg-yellow-300/40 text-yellow-800",
    webinar: "bg-green-300/40 text-green-800",
    concert: "bg-purple-300/40 text-purple-800",
    festival: "bg-violet-300/40 text-violet-800",
    conference: "bg-cyan-300/40 text-cyan-800",
    competition: "bg-amber-300/40 text-amber-800",
    meetup: "bg-indigo-300/40 text-indigo-800",
    sports: "bg-lime-300/40 text-lime-800",
    exhibition: "bg-sky-300/40 text-sky-800",
    charity: "bg-fuchsia-300/40 text-fuchsia-800",
    others: "bg-slate-300/40 text-slate-800",
  };

  const startDateDt = new Date(startDate).getDate();
  const startDateMt = new Date(startDate)
    .toLocaleString("default", {
      month: "short",
    })
    .toUpperCase();

  return (
    <div className="min-w-0 flex-[0_0_100%] bg-white rounded-md shadow-sm h-fit min-h-96 md:min-h-72 lg:min-h-64 md:pb-0 overflow-hidden">
      {/* Layout card */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Gambar */}
        <div className="w-full md:w-2/5 aspect-[16/9] md:aspect-auto md:h-72 overflow-hidden">
          <img
            src={bannerUrl ? bannerUrl : placeholder}
            alt="event image"
            className="w-full h-full object-cover brightness-85 hover:brightness-100 transition-all rounded-l-md md:rounded-none"
          />
        </div>
        {/* Informasi */}
        <div className="w-full flex flex-col gap-2 px-4 lg:px-7 md:justify-center md:py-5 min-h-100 md:min-h-0 justify-evenly py-6">
          {/* Title & category */}
          <div className="flex flex-col justify-between items-center gap-2 mb-2 md:flex-row text-center md:text-start">
            {" "}
            <h3 className="font-bold  text-xl lg:text-2xl">
              {title ? title : "Event Title"}
            </h3>
            <p
              className={`text-[10px] px-2 py-1 font-medium ${
                categoryColor[category?.toLowerCase()] ??
                "bg-slate-300/40 text-slate-800"
              } rounded-sm`}
            >
              {category ? category : "Category"}
            </p>
          </div>
          {/* Desc */}
          <p className="text-sm text-center md:text-justify">{description}</p>
          {/* Detailed Info */}
          <div className="flex flex-col md:flex-row gap-8 mt-3 justify-center md:justify-start">
            {/* Tanggal */}
            <div className="w-full md:w-fit flex flex-col justify-center items-center pt-4 md:pr-6 md:pt-0  border-t-2 md:border-r-2 border-gray-200/70 md:border-t-0">
              <span className="font-medium tracking-widest w-full text-center">
                {startDateMt}
              </span>
              <p className="font-extrabold text-4xl">
                {startDateDt ? startDateDt : "start date"}
              </p>
            </div>
            {/* Place & Ticket */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <span className="p-1 bg-gray-200/40 rounded-md cursor-pointer hover:shadow-sm">
                  <MapPin size={16} />
                </span>
                <span className="text-sm text-gray-700">
                  {location ? location : "Location"}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="p-1 bg-gray-200/40 rounded-md cursor-pointer hover:shadow-sm">
                  <Wallet size={16} />
                </span>
                <span className="text-sm text-gray-700">
                  {ticketPrice ? `Rp. ${ticketPrice},00` : "FREE"}
                </span>
              </div>
            </div>
          </div>
          {/* Button */}
          <div className="flex justify-end">
            <a
              href={link ? link : "#"}
              className="p-1 bg-blue-500 rounded-full text-white hover:shadow-md hover:shadow-blue-400/60 transition-all"
            >
              <ArrowDownRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCarouselCard;
