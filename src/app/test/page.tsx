import React from 'react'

import ModalForPreview from '@/components/modals/ModalForPreview'
import OfferDetail from '@/components/pieces/OfferDetail'

export default function test() {
  return (
    <div>
          <ModalForPreview title={"Preview Full"}>
            <OfferDetail />
          </ModalForPreview>
    </div>
  )
}
