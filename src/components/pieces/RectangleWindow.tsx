import React from 'react'

export default function RectangleWindow(props:any) {
  return (
    <div className='bg-blue bg-slate-800 md:max-w-2/12 md:min-h-80 shadow-md m-2 md:m-0 font-oswald font-medium max-h-15 overflow-hidden'>
      <h2 className='Titulo text-white text-4xl text-center md:text-start font-bold text-shadow-2xs absolute md:max-w-2/12 pt-2 pl-1'>{props.text}</h2>
      <div className='fotoFondo bg-cyan-700 w-96 h-80'></div>
    </div>
  )
}
