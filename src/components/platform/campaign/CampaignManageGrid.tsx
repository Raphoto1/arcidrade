import React from 'react'

import CampaignData from './CampaignData'
import CampaignGenerateInvitations from './CampaignGenerateInvitations'
import CampaignListLeads from './CampaignListLeads'

export default function CampaignManageGrid() {
  return (
    <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-4 md:max-h-3/4'>
      <CampaignData />
      <CampaignGenerateInvitations />
      <CampaignListLeads />
    </div>
  )
}
