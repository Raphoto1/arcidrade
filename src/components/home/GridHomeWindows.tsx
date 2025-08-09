//app imports
import React from 'react'
//project imports
import RectangleWindow from '../pieces/RectangleWindow'

export default function GridHomeWindows() {
  return (
    <div className='max-w-screen justify-around flex flex-col md:flex-row lg:bg-amber-600 bg-cyan-400'>
      <RectangleWindow text={'Madrid'} image={'Madrid'} />
      <RectangleWindow text={'Hola Mundo 2'} image={'sdsd'} />
      <RectangleWindow text={'Hola Mundo 3'} image={'sdsd'} />
      <RectangleWindow text={'Hola Mundo 4'} image={'sdsd'} />
    </div>
  )
}
