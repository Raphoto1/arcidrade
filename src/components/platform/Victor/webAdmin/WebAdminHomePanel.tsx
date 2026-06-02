"use client";
import ModalForPreview from "@/components/modals/ModalForPreview";
import WebAdminHomePreview from "@/components/platform/Victor/webAdmin/previews/WebAdminHomePreview";
import CarouselAdmin from "@/components/platform/Victor/webAdmin/homeAdminPanel/CarouselAdmin";
import MainGridOffersAdmin from "./homeAdminPanel/MainGridOffersAdmin";
import MainSpecialitiesAdmin from "./homeAdminPanel/MainSpecialitiesAdmin";
import MainProvincesAdmin from "./homeAdminPanel/MainProvincesAdmin";

export default function WebAdminHomePanel() {
  return (
    <article className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='h-2 w-full bg-linear-to-r from-(--main-arci) to-(--orange-arci)' />
      <div className='p-4'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='font-oswald text-xl text-(--main-arci)'>Home — General</h2>
          <ModalForPreview title='Ver preview del home'>
            <WebAdminHomePreview />
          </ModalForPreview>
        </div>
        <CarouselAdmin />
        <MainGridOffersAdmin />
        <MainProvincesAdmin />
        <MainSpecialitiesAdmin />
      </div>
    </article>
  );
}
