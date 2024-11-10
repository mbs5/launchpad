"use client";

import { useState } from "react";
import { examples } from "../examplesList";
import ChatInterface from "../chat/ChatInterface";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl">
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">{examples[currentIndex].name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {examples[currentIndex].description}
          </p>
          <ChatInterface example={examples[currentIndex]} />
        </div>
      </div>
      
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          ←
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          →
        </button>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        {examples.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
} 