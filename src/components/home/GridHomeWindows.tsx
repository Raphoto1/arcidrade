//app imports
import React from 'react'
//project imports
import RectangleWindow from '../pieces/RectangleWindow'

export default function GridHomeWindows() {
  return (
    <div className='max-w-full flex justify-around'>
      <RectangleWindow text={'Hola Mundo'} image={'sdsd'} />
      <RectangleWindow text={'Hola Mundo2'} image={'sdsd'} />
      <RectangleWindow text={'Hola Mundo33'} image={'sdsd'} />
      <RectangleWindow text={'Hola Mundo4' } image={'sdsd' } />
    </div>
  )
}
