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

        <img src={props.mainImage} className='w-fit h-full absolute' />
      </div>
      <div className='longText p-5 first-letter:text-3xl font-roboto-condensed'>
        <p>
          {props.longText}
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium quisquam maxime qui culpa assumenda recusandae quasi quas molestias, beatae
          eligendi dignissimos, fugiat, tempore porro mollitia dicta sunt ipsam excepturi in! Earum ex modi quia asperiores assumenda possimus ducimus
          repellendus. Quibusdam deserunt, ex nostrum veniam officia tempora ab pariatur quam cupiditate voluptatibus non praesentium, eveniet exercitationem
          assumenda quia itaque! Dolorem cumque eius labore illo inventore nisi numquam autem quibusdam quia! Aperiam cupiditate velit, dolorem quia,
          necessitatibus, fuga commodi asperiores sed tenetur placeat est sunt. Rerum ut, cum sit quod quasi eligendi!
        </p>
      </div>
    </div>
  );
}
