//app imports
import React from "react";
//project imports
import RectangleWindow from "../pieces/RectangleWindow";
import { mainCities } from "@/static/data/staticData";

export default function GridHomeWindowsCities() {
  return (
    <div className='flex w-full flex-col gap-3 px-2 md:flex-row md:gap-12 md:px-4'>
      {mainCities.map((offer: { title: string; image: string; link: string }, index: number) => {
        return <RectangleWindow key={index} text={offer.title} image={offer.image} link={offer.link} />;
      })}
    </div>
  );
}
