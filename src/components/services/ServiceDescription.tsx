import React from "react";

import BrColors from "../pieces/BrColors";

export default function ServiceDescription(props: { title: string; mainImage?: string; longText?: string; ExtraText?: string }) {
  return (
    <div>
      <BrColors title={props.title} />
      <div className='carousel-item w-full relative h-36 md:h-96'>
        <h2 className='z-1 text-xl md:text-5xl text-white text-shadow-lg font-oswald font-bold max-w-2/3 md:max-w-3/4 pl-10 md:pl-50 md:pt-20'>
          {props.ExtraText}
        </h2>

        <img src={props.mainImage} className='w-full h-full object-cover absolute' />
      </div>
      <div className='longText p-5 first-letter:text-3xl font-roboto-condensed'>
        <p className="text-justify text-xl">
          {props.longText}
        </p>
      </div>
    </div>
  );
}
