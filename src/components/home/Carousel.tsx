'use client';
import { useEffect, useState } from "react";
import { carouselHome } from "@/static/data/staticData";

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselHome.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {carouselHome.map((data: { text: string; image: string }, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img src={data.image} alt={data.text} className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-8 text-white text-xl md:text-5xl font-bold drop-shadow-lg font-oswald">
            {data.text}
          </div>
        </div>
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselHome.map((_:any, index: number) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
