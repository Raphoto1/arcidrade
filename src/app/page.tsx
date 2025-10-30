//app imports
import Image from "next/image";
//project imports
import Carrousel from "@/components/home/Carousel";
import Steps from "@/components/home/Steps";
import GridHomeWindows from "@/components/home/GridHomeWindows";
import GridHomeWindowsCities from "@/components/home/GridHomeWindowsCities";
import GridHomeWindowsSpecialities from "@/components/home/GridHomeWindowsSpecialities";
import BrColors from "@/components/pieces/BrColors";
import ThreeColumnGrid from "@/components/Grids/ThreeColumnGrid";
import InstitutionGridSearch from "@/components/platform/institution/InstitutionGridSearch";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";

export default function Home() {
  return (
    <main className='flex flex-col items-center gap- min-h-screen justify-center'>
      {/* <div>
        Usuarios Para prueba
        <div>
          DEVNODE
          <p>Institution: rafa@creativerafa.com pass:12345</p>
          <p>Profesional: rrhhmmtt@gmail.com pass:12345</p>
          <p>admin: sdsQ@huss.com pass:12345</p>
        </div>
      </div> */}
      <Carrousel />
      <Steps />
      <GridHomeWindows />
      <ThreeColumnGrid />
      <BrColors title={"Principales Provincias"} />
      <GridHomeWindowsCities />
      <BrColors title={"Principales Especialidades"} />
      <GridHomeWindowsSpecialities />
      {/* <BrColors title={"Profesionales"} />
      <div className='w-full flex flex-col items-center justify-center p-4'>
        <InstitutionGridSearch isFake={true} />
      </div>
            <BrColors title={"Instituciones"} />
      <div className='w-full flex flex-col items-center justify-center p-4'>
        <ProfesionalGridSearch isFake={true} />
      </div> */}
    </main>
  );
}
