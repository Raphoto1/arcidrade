//app imports
import Image from "next/image";
//project imports
import Carrousel from "@/components/home/Carousel";
import Steps from "@/components/home/Steps";
import GridHomeWindows from "@/components/home/GridHomeWindows";
import BrColors from "@/components/pieces/BrColors";
import ThreeColumnGrid from "@/components/Grids/ThreeColumnGrid";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap- min-h-screen justify-center">
      <Carrousel />
      <Steps />
      <GridHomeWindows />
      <BrColors title={'Ofertas'} />
      <ThreeColumnGrid />
      <BrColors title={'Principales Ciudades'} />
      <GridHomeWindows />
      <BrColors title={'Principales Especialidades'} />
      <GridHomeWindows />
    </main>
  );
}
