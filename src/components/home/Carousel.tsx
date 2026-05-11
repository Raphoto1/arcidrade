'use client';
import { useEffect, useState } from "react";
import useSWR from "swr";
import { carouselHome } from "@/static/data/staticData";

type CarouselSlide = { text: string; image: string };

type PublicStructureResponse = {
  success: boolean;
  payload?: {
    home?: {
      carousel?: Array<{
        id: number;
        text: string;
        image: string | null;
        order: number | null;
      }>;
    };
  };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const { data } = useSWR<PublicStructureResponse>("/api/public/publicStructure", fetcher);

  const apiSlides: CarouselSlide[] = Array.isArray(data?.payload?.home?.carousel)
    ? data!.payload!.home!.carousel!
        .filter((item) => typeof item.text === "string" && item.text.trim() && typeof item.image === "string" && item.image.trim())
        .sort((a, b) => {
          const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        })
        .map((item) => ({ text: item.text, image: item.image as string }))
    : [];

  const slides: CarouselSlide[] = apiSlides.length > 0
    ? apiSlides
    : carouselHome.map((item: any) => ({ text: item.text, image: item.image }));

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  if (!slides.length) {
    return <div className="relative w-full h-96 overflow-hidden bg-gray-100" />;
  }

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {slides.map((data, index: number) => (
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
        {slides.map((_, index: number) => (
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
