"use client";

import useSWR from "swr";
import BrColors from "@/components/pieces/BrColors";
import DynamicThreeColumnGrid from "@/components/Grids/DynamicThreeColumnGrid";
import AboutItemCard from "@/components/about/AboutItemCard";
import { aboutItems as staticAboutItems } from "@/static/data/staticData";

type AboutItem = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  link: string | null;
  order: number | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AboutContent() {
  const { data } = useSWR<{ success: boolean; payload: AboutItem[] }>("/api/public/about-page", fetcher);

  const hasDbData = Boolean(data?.success && Array.isArray(data.payload) && data.payload.length > 0);
  const items = hasDbData ? data!.payload : staticAboutItems;

  return (
    <div>
      <BrColors title='Acerca de Nosotros' />
      <section className='flex justify-center max-w-7xl mx-auto p-4'>
        <DynamicThreeColumnGrid>
          {items.map((item: any, index: number) => (
            <AboutItemCard
              title={item.title}
              description={item.description}
              image={item.image}
              key={typeof item.id === "number" ? item.id : index}
            />
          ))}
        </DynamicThreeColumnGrid>
      </section>
    </div>
  );
}
