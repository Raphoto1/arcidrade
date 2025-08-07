//app imports
import Image from "next/image";
//project imports
import Carrousel from "@/components/home/Carousel";
import Steps from "@/components/home/Steps";
import GridHomeWindows from "@/components/home/GridHomeWindows";

export default function Home() {
  return (
    <main className="flex flex-col justify-between">
      <Carrousel />
      <Steps />
      <GridHomeWindows/>
    </main>
  );
}
