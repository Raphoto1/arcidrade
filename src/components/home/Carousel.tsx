import React from "react";

export default function Carousel() {
  return (
    <div className='carousel w-full'>
      <div id='item1' className='carousel-item w-full'>
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
      </div>
    </div>
  );
}
