// Assets
import HeroImage from "../../src/assets/Hero.png";

import { motion, easeIn } from "motion/react";

function Hero() {
  return (
    <>
      {/* Container */}
      <section className="flex px-28 pt-32 pb-28 flex-col-reverse md:flex-row justify-between gap-12 relative overflow-hidden items-center text-gray-900">
        {/* Left - Text */}
        <div className="flex flex-col items-center min-w-xs justify-center gap-8 align-middle text-center md:items-baseline md:text-start md:w-lg">
          <motion.h1
            key={"header"}
            initial={{ top: -100, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative leading-tight lg:text-6xl text-5xl font-bold md:mb-6"
          >
            Discover and Manage Events in One Place 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: easeIn }}
            className="text-md lg:text-lg"
          >
            Evently helps you create, promote, and enjoy events of all types —
            faster and easier than ever.{" "}
            <span className="font-bold">Plan less, celebrate more!</span>
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: easeIn }}
            className="px-4 py-3 cursor-pointer bg-blue-600 rounded-lg text-sm md:text-md text-white w-48 lg:w-64 hover:shadow-lg hover:shadow-blue-400/50 hover:-translate-y-1 transition-all"
          >
            {" "}
            Discover More{" "}
          </motion.button>
        </div>
        {/* Right - Hero Image */}
        <motion.div
          key="image"
          className=" justify-center flex shrink-0  md:w-fit md:h-fit"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src={HeroImage}
            alt="hero image"
            className="size-full w-[280px] h-[280px] shrink-0 md:size-96 lg:size-128 hover:scale-105 transition-transform"
          />
        </motion.div>
      </section>
    </>
  );
}

export default Hero;
