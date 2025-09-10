import React from 'react'

import CampaignData from './CampaignData'

export default function CampaignManageGrid() {
  return (
    <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-4 md:max-h-3/4'>
<CampaignData />
    </div>
  )
}
