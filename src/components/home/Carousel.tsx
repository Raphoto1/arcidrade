import React from "react";
import { carouselHome } from "@/static/data/staticData";
import Image from "next/image";
export default function Carousel() {
  return (
    <div className='carousel w-full h-2/3'>
      {carouselHome.map((data: { text: string; image: string }, index: number) => {
        return (
          <div key={index} id={`item${index + 1}`} className='carousel-item w-full relative h-36 md:h-96'>
            <h2 className='z-1 text-xl md:text-5xl text-white text-shadow-lg font-oswald font-bold max-w-2/3 md:max-w-3/4 pl-10 md:pl-50 md:pt-20'>
              {data.text}
            </h2>

            <img src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp' className='w-fit h-full absolute' />
          </div>
        );
      })}
      agregar dedo de slide en mobile
      <div className='w-full justify-center gap-2 py-2 absolute self-end hidden md:flex z-10'>
        <a href='#item1' className='btn btn-xs'>
          1
        </a>
        <a href='#item2' className='btn btn-xs'>
          2
        </a>
        <a href='#item3' className='btn btn-xs'>
          3
        </a>
      </div>
      {/* <div id='item1' className='carousel-item w-full'>
        <h2 className="absolute text-5xl text-white  left-1/12 top-2/12 text-shadow-lg font-oswald font-bold">phrase 1 with really long catch</h2>
        <img src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp' className='w-full' />
      </div>
      <div id='item1' className='carousel-item w-full'>
        <img src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp' className='w-full' />
      </div>
      <div id='item1' className='carousel-item w-full'>
        <img src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp' className='w-full' />
      </div>
      <div className='flex w-full justify-center gap-2 py-2'>
        <a href='#item1' className='btn btn-xs'>
          1
        </a>
        <a href='#item2' className='btn btn-xs'>
          2
        </a>
        <a href='#item3' className='btn btn-xs'>
          3
        </a>
        <a href='#item4' className='btn btn-xs'>
          4
        </a>
      </div> */}
    </div>
  );
}
