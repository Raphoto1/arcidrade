"use client";

import useSWR from "swr";
import ServiceDescription from "@/components/services/ServiceDescription";
import { servicesItems as staticServicesItems } from "@/static/data/staticData";

type ServicesItem = {
  id: number;
  title: string;
  extraText: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  order: number | null;
  contact?: boolean;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicesContent() {
  const { data } = useSWR<{ success: boolean; payload: ServicesItem[] }>("/api/public/services-page", fetcher);

  const hasDbData = Boolean(data?.success && Array.isArray(data.payload) && data.payload.length > 0);
  const items = hasDbData ? data!.payload : staticServicesItems;

  return (
    <div>
      {items.map((item: any, index: number) => (
        <ServiceDescription
          key={typeof item.id === "number" ? item.id : index}
          title={item.title}
          longText={item.description ?? item.longText}
          mainImage={item.image}
          ExtraText={item.extraText ?? item.title}
          link={item.link}
          contact={Boolean(item.contact)}
        />
      ))}
    </div>
  );
}
