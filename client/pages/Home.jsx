// Library
import { motion } from "motion/react";

// Components
import Hero from "../components/Home/Hero";
import UpcomingSection from "../components/Home/UpcomingSection";
import CategoriesSection from "../components/Home/CategoriesSection";
import FaqSection from "../components/Home/FaqSection";

function Home() {
  return (
    <motion.div>
      {/* Blob */}
      <div className="absolute -top-60 w-[600px] h-[600px] bg-gradient-to-t from-blue-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      {/* Hero Section */}
      <Hero />
      {/* Blob */}
      <div className="absolute -top-50 opacity-0 md:opacity-100 md:top-100  md:-right-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-blue-500/40 rounded-full blur-[80px] -z-10"></div>
      {/* Upcoming Section */}
      <UpcomingSection />
      <div className="absolute bottom-10 w-[600px] h-[600px] bg-gradient-to-t from-blue-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      {/* Categories Section */}
      <CategoriesSection />
      {/* FAQ Section */}
      <FaqSection />
    </motion.div>
  );
}

export default Home;
