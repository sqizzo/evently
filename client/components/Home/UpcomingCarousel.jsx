// Basic
import React, { useCallback } from "react";

// Library
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

// Components
import EventCarouselCard from "./EventCarouselCard";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

function UpcomingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    WheelGesturesPlugin({ forceWheelAxis: "y" }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const mockUpcomingEvents = [
    {
      _id: "1",
      name: "Jakarta Web Workshop 2025",
      description: "Belajar langsung dari praktisi web development Indonesia!",
      startDate: "2025-08-01T09:00:00.000Z",
      location: "Jakarta Convention Center",
      bannerUrl:
        "https://res.cloudinary.com/dcmvggv9b/image/upload/v1752587083/evently/rfjyquxs5ur59npayitz.jpg",
      ticketPrice: 150000,
      category: "workshop",
      totalBookmark: 24,
      author: {
        _id: "admin-1",
        username: "sqizzoadmin",
        email: "sqizzoadmin123@gmail.com",
      },
      createdAt: "2025-07-15T13:26:17.691Z",
      updatedAt: "2025-07-15T13:44:44.426Z",
      status: "upcoming",
      id: "1",
    },
    {
      _id: "2",
      name: "Startup Pitch Day",
      description: "Presentasikan ide bisnismu dan dapatkan investor!",
      startDate: "2025-08-03T14:00:00.000Z",
      location: "Bandung Digital Valley",
      bannerUrl:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1280&q=80",
      ticketPrice: 0,
      category: "seminar",
      totalBookmark: 67,
      author: {
        _id: "admin-2",
        username: "startuphero",
        email: "hero@startup.com",
      },
      createdAt: "2025-07-10T10:00:00.000Z",
      updatedAt: "2025-07-12T08:44:00.000Z",
      status: "upcoming",
      id: "2",
    },
    {
      _id: "3",
      name: "Indie Music Fest",
      description: "Nikmati musik dari band-band indie lokal favoritmu!",
      startDate: "2025-08-05T17:00:00.000Z",
      location: "Lapangan Banteng, Jakarta",
      bannerUrl:
        "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1280&q=80",
      ticketPrice: 50000,
      category: "concert",
      totalBookmark: 102,
      author: {
        _id: "admin-3",
        username: "musiklover",
        email: "indie@music.com",
      },
      createdAt: "2025-07-11T14:30:00.000Z",
      updatedAt: "2025-07-14T10:15:00.000Z",
      status: "upcoming",
      id: "3",
    },
    {
      _id: "4",
      name: "Tech Expo 2025",
      description: "Pameran teknologi terbaru dari perusahaan startup lokal.",
      startDate: "2025-08-10T10:00:00.000Z",
      location: "ICE BSD, Tangerang",
      bannerUrl:
        "https://res.cloudinary.com/dcmvggv9b/image/upload/v1752587083/evently/rfjyquxs5ur59npayitz.jpg",
      ticketPrice: 100000,
      category: "exhibition",
      totalBookmark: 38,
      author: {
        _id: "admin-4",
        username: "techwizard",
        email: "tech@expo.com",
      },
      createdAt: "2025-07-13T11:12:00.000Z",
      updatedAt: "2025-07-14T08:32:00.000Z",
      status: "upcoming",
      id: "4",
    },
    {
      _id: "5",
      name: "Frontend Developer Meetup",
      description: "Kopdar komunitas frontend developer se-Indonesia.",
      startDate: "2025-08-15T13:00:00.000Z",
      location: "GoWork Menara Rajawali, Jakarta",
      bannerUrl:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1280&q=80",
      ticketPrice: 30000,
      category: "meetup",
      totalBookmark: 55,
      author: {
        _id: "admin-5",
        username: "frontendfan",
        email: "meetup@frontend.com",
      },
      createdAt: "2025-07-10T09:00:00.000Z",
      updatedAt: "2025-07-15T12:10:00.000Z",
      status: "upcoming",
      id: "5",
    },
  ];

  return (
    <>
      <div className="relative flex justify-between top-1/2 z-100 w-full">
        <button
          className="embla__prev p-3 bg-slate-500/30 transition-all rounded-full text-white cursor-pointer"
          onClick={scrollPrev}
        >
          <ChevronsLeft size={24} />
        </button>
        <button
          className="embla__next p-3 bg-slate-500/30  transition-all rounded-full text-white cursor-pointer"
          onClick={scrollNext}
        >
          <ChevronsRight size={24} />
        </button>
      </div>
      <div className="overflow-hidden text-gray-900" ref={emblaRef}>
        {/* Gap untuk tiap carousel horizontal  */}
        <div className="flex gap-x-7 p-2">
          {/* Carousel card start */}
          {mockUpcomingEvents.map((e) => {
            return (
              <EventCarouselCard
                key={e._id}
                ticketPrice={e.ticketPrice.toLocaleString("id")}
                title={e.name}
                description={e.description}
                startDate={e.startDate}
                location={e.location}
                bannerUrl={e.bannerUrl}
                category={e.category[0].toUpperCase() + e.category.substring(1)}
                link={e._id}
              />
            );
          })}
        </div>
        {/* Prev & Next button */}
      </div>
    </>
    /* Embla carousel start */
  );
}

export default UpcomingCarousel;
