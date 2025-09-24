import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton"
import Certificate from "../pieces/Certificate"
ModalForFormsPlusButton

export default function Certifications() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 overflow-auto md:h-auto'>
      <div className="pb-1">
              <h1 className="text-2xl fontArci text-center">Certificaciones</h1>
      </div>
      <div className="max-h-110 overflow-auto">
        <Certificate/>
        <Certificate />
        <Certificate />
        <Certificate />
        <Certificate/>
      </div>
      <div className='m-1 flex justify-center items-center gap-1'>
              <div className='flex justify-center'>
                <ModalForFormsPlusButton title='Agregar Certificacion'>

                </ModalForFormsPlusButton>
              </div>
            </div>
    </div>
  )
}