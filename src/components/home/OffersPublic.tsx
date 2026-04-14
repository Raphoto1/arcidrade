import React from "react";
import ProcessesGridSearchPublic from "../pieces/ProcessesGridSearchPublic";

type OffersPublicProps = {
  trackingSource?: string;
  title?: string;
};

export default function OffersPublic({
  trackingSource = "public_offers",
  title = "Principales Ofertas Disponibles",
}: OffersPublicProps) {
  return (
    <div className='grid w-full grid-cols-1 gap-4 p-4 md:max-h-3/4 md:items-center md:justify-center md:align-middle'>
      <h2 className='text-2xl fontArci text-center'>{title}</h2>
      <ProcessesGridSearchPublic isFake={false} applyButton={false} trackingSource={trackingSource} />
    </div>
  );
}
