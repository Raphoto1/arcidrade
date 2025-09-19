import React from 'react'

import HeroHeader from '../pieces/HeroHeader'
import ManageGrid from './ManageGrid'
import MyAplications from './MyAplications'
import Offers from './Offers'
import { useProfesional } from '@/hooks/usePlatPro'

export default function Profesional() {
const GeneralData= useProfesional()
  
  return (
    <div className=''>
      <HeroHeader />
      <ManageGrid />
      <MyAplications />
      <Offers />
    </div>
  )
}
