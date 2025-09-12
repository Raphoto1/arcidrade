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

export default function Home() {
  return (
    <main className="flex flex-col items-center gap- min-h-screen justify-center">
      <div>
        Usuarios Para prueba
        <div>

          <p>Institution: rafa@creativerafa.com pass:12345</p>
          <p>Profesional: rrhhmmtt@gmail.com pass:12345</p>
          <p>admin: sdsQ@huss.com pass:12345</p>
        </div>
      </div>
      <Carrousel />
      <Steps />
      <GridHomeWindows />
      <BrColors title={'Ofertas'} />
      <ThreeColumnGrid />
      <BrColors title={'Principales Ciudades'} />
      <GridHomeWindowsCities />
      <BrColors title={'Principales Especialidades'} />
      <GridHomeWindowsSpecialities />
    </main>
  );
}
