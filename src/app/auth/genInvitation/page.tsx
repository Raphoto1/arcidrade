'use client'
import React from 'react'
import { useRef } from 'react'
import { useHandleSubmitText } from '@/hooks/useFetch'

import GenerateInvitation from '@/components/auth/GenerateInvitation'

export default function genInvitation() {

  return (
    <div className='flex justify-center items-center h-1/2 p-5 max-w-md md:max-w-full'>
      <GenerateInvitation/>
</div>
  )
}
