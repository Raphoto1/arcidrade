import ServicesCardsAdmin from "@/components/platform/Victor/webAdmin/servicesAdminPanel/ServicesCardsAdmin";

export default function WebAdminServicesPanel() {
  return (
    <article className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='h-2 w-full bg-linear-to-r from-sky-500 to-cyan-400' />
      <div className='p-4'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='font-oswald text-xl text-(--main-arci)'>Services - General</h2>
        </div>
        <ServicesCardsAdmin />
      </div>
    </article>
  );
}