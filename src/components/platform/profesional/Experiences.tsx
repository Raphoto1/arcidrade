import Experience from "../pieces/Experience"

export default function Experiences() {
  return (
    <div className='flex-col justify-start h-3/4 bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:overflow-auto'>
      <div className="pb-2">
              <h1 className="text-2xl fontArci text-center">Experiencia</h1>
      </div>
      <Experience/>
      <Experience/>
    </div>
  )
}