import React from "react";

// Components
import FaqImage from "../../src/assets/faq.png";
import AccordionItem from "./AccordionItem";

function FaqSection() {
  // Data
  const faqData = [
    {
      title: "What is Evently?",
      ans: "Evently is a platform where you can discover, promote, and manage events all in one place.",
    },
    {
      title: "How do I create an event?",
      ans: "Sign in, click 'Create Event' in the dashboard, fill in the event details, and publish it.",
    },
    {
      title: "Is Evently free to use?",
      ans: "Yes! You can explore and promote events for free. We also offer premium features for organizers.",
    },
    {
      title: "Can I browse events without creating account?",
      ans: "You can browse public events without logging in, but you’ll need an account to register or buy tickets.",
    },
  ];

  return (
    <section className="flex px-28 flex-col justify-center mb-20 text-gray-900 border-t-2 border-t-gray-300/20 w-full">
      {/* Section title */}
      <div className="flex flex-col pt-14 pb-8 gap-4 text-center ">
        <h2 className="text-4xl font-extrabold">Got Any Questions?</h2>
        <p className="">We've got you covered!</p>
      </div>
      {/* Accordion Box*/}
      <div className="flex gap-14 pt-14 h-140">
        {/* Illustration */}
        <img
          src={FaqImage}
          alt="question illustration"
          className="w-80 h-80 object-contain"
        />

        {/* Accordion */}
        <div className="flex gap-4 flex-col w-full">
          {faqData.map((e) => (
            <AccordionItem title={e.title} ans={e.ans} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
