//app imports
import React from 'react'
import Link from 'next/link'
//project imports
import RectangleWindow from '../pieces/RectangleWindow'
import { mainCities } from '@/static/data/staticData'

export default function GridHomeWindowsCities() {
  return (
    <div className='max-w-screen justify-around flex flex-col md:flex-row'>
      {mainCities.map((offer:{title:string, image:string, link:string}, index:number) => {
        return (
          <RectangleWindow key={index} text={offer.title} image={offer.image} link={offer.link } />
      )})}
    </div>
  )
}
