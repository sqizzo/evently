// Assets
import Hero from "../src/assets/Hero.avif";

function Home() {
  return (
    <>
      {/* Container */}
      <div className="flex px-28 py-8 flex-col-reverse md:flex-row justify-between gap-12">
        {/* Left - Text */}
        <div className="flex flex-col items-center justify-center gap-6 align-middle text-center md:items-baseline md:text-start md:w-lg">
          <h1 className="leading-tight text-4xl md:text-6xl font-bold md:mb-6">
            Discover and Manage Events in One Place 🎉
          </h1>
          <p className="text-md md:text-lg">
            Evently helps you create, promote, and enjoy events of all types —
            faster and easier than ever. Plan less, celebrate more!
          </p>
          <button className="px-4 py-3 cursor-pointer bg-blue-500 rounded-xl text-white w-64 md:w-64 hover:shadow-lg hover:shadow-blue-400/50 hover:-translate-y-1 transition-all">
            {" "}
            Discover More{" "}
          </button>
        </div>
        {/* Right - Hero Image */}
        <div className="flex shrink-0">
          <img
            src={Hero}
            alt="hero image"
            className="size-full shrink-0 md:size-148 hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
