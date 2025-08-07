import React from 'react'

export default function RectangleWindow(props:any) {
  return (
    <div className='bg-blue bg-slate-800 max-w-2/12 min-h-svh shadow-md p-2'>
          <h2 className='text-white text-4xl text-start font-bold text-shadow-2xs'>{props.text }</h2>
    </div>
  )
}
