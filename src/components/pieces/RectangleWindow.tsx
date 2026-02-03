import React from "react";
import Image from "next/image";
import Link from "next/link";
// project imports


export default function RectangleWindow(props: {text: string, image: string, link?:string}) {
  return (
    <Link href={props.link||"/"} className='bg-blue bg-slate-800 md:max-w-2/12 md:min-h-80 shadow-md m-2 md:m-0 font-oswald font-medium max-h-15 overflow-hidden'>
      <h2 className='Titulo text-white text-3xl text-center md:text-start font-bold text-shadow-lg drop-shadow-2xl absolute md:max-w-2/12 pt-2 pl-1'>{props.text}</h2>
      <Image
        src={props.image}
        className='w-96 h-80 max-w-96'
        width={600}
        height={600}
        style={{ objectFit: 'cover' }}
        alt='fillImage'
      />
    </Link>
  );
}
