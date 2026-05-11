import AboutCardsAdmin from "@/components/platform/Victor/webAdmin/aboutAdminPanel/AboutCardsAdmin";

export default function WebAdminAboutPanel() {
  return (
    <article className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='h-2 w-full bg-linear-to-r from-[#ca8a04] to-[#f59e0b]' />
      <div className='p-4'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='font-oswald text-xl text-(--main-arci)'>About - General</h2>
        </div>
        <AboutCardsAdmin />
      </div>
    </article>
  );
}