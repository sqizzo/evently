import React, { useState } from "react";

// Components
import { ChevronDown, ChevronUp } from "lucide-react";

function AccordionItem({ title, ans }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex flex-col px-6 py-4 bg-gradient-to-tr from-white to-purple-100/45 rounded-md cursor-pointer shadow-sm transition-all"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Accordion Title */}
      <div className="flex justify-between w-full items-center">
        <h3 className="text-lg font-bold">{title ?? "Accordion Title"} </h3>
        <span className="p-2 rounded-full">
          {isOpen ? <ChevronDown /> : <ChevronUp />}
        </span>{" "}
      </div>
      {/* Accordion Answer */}
      {isOpen && (
        <div className="pt-4 mt-2 border-t-2 border-gray-200/70 text-sm">
          {ans ?? "Accordion answer"}
        </div>
      )}
    </div>
  );
}

export default AccordionItem;
