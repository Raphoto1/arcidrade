import React from "react";

export default function AboutItemCard(props: any) {
  return (
    <div className='card bg-base-100 image-full w-96 shadow-sm'>
      <figure>
        <img src={props.image} alt='Shoes' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title text-4xl'>{props.title}</h2>
        <p className='text-lg'>{props.description}</p>
      </div>
    </div>
  );
}
