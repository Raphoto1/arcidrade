"use client";
//app imports
import React from "react";
import useSWR from "swr";
//project imports
import RectangleWindow from "../pieces/RectangleWindow";
import { mainCities } from "@/static/data/staticData";

type PublicStructureResponse = {
  success: boolean;
  payload?: {
    home?: {
      main_provinces?: Array<{
        id: number;
        title: string;
        description: string | null;
        image: string | null;
        link: string | null;
        order: number | null;
      }>;
    };
  };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function GridHomeWindowsCities() {
  const { data } = useSWR<PublicStructureResponse>("/api/public/publicStructure", fetcher);

  const apiProvinces = Array.isArray(data?.payload?.home?.main_provinces)
    ? data!.payload!.home!.main_provinces!
        .filter((item) => typeof item.title === "string" && item.title.trim() && typeof item.image === "string" && item.image.trim())
        .sort((a, b) => {
          const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        })
    : [];

  const provinces = apiProvinces.length > 0
    ? apiProvinces.map((item) => ({ title: item.title, image: item.image as string, link: item.link ?? "/offers" }))
    : mainCities.map((item: any) => ({ title: item.title, image: item.image, link: item.link ?? "/offers" }));

  return (
    <div className='flex w-full flex-col gap-3 px-2 md:flex-row md:gap-12 md:px-4'>
      {provinces.map((offer: { title: string; image: string; link: string }, index: number) => {
        return <RectangleWindow key={index} text={offer.title} image={offer.image} link={offer.link} />;
      })}
    </div>
  );
}
