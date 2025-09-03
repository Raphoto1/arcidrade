import React from 'react'

import HeroHeader from './pieces/HeroHeader'
import ManageGrid from './profesional/ManageGrid'
import MyAplications from './profesional/MyAplications'
import Offers from './profesional/Offers'
export default function Profesional() {
  return (
    <div className=''>
      <HeroHeader />
      <ManageGrid />
      <MyAplications />
      <Offers />
    </div>
  )
}
