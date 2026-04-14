import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function RectangleWindow(props: { text: string; image: string; link?: string }) {
  return (
    <Link
      href={props.link || "/"}
      className='group relative block min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-800 font-oswald font-medium shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl'
    >
      <div className='absolute inset-0 z-10 bg-linear-to-t from-black/65 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/45 group-hover:via-black/10' />
      <h2 className='absolute inset-x-0 top-0 z-20 px-3 pt-3 text-center text-2xl font-bold text-white drop-shadow-xl [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_6px_18px_rgba(0,0,0,0.28)] md:text-start md:text-3xl'>
        {props.text}
      </h2>
      <Image
        src={props.image}
        className='h-64 w-full object-cover brightness-90 transition duration-500 group-hover:scale-105 group-hover:brightness-110 md:h-80'
        width={600}
        height={600}
        alt='fillImage'
      />
    </Link>
  );
}
