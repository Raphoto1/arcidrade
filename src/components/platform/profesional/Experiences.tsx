import Experience from "../pieces/Experience"

export default function Experiences() {
  return (
    <div className='flex-col justify-start md:h-auto bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 md:overflow-auto'>
      <div className="pb-1">
              <h1 className="text-2xl fontArci text-center">Experiencia</h1>
      </div>
     <div className="max-h-110 overflow-auto">
       <Experience/>
       <Experience/>
     </div>
    </div>
  )
}