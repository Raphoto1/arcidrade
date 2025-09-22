import useSWR from "swr";

type ProfesionalResponse = {
  payload: any; // Puedes reemplazar `any` por un tipo más preciso si tienes el modelo
};

const fetcher = async (url: string): Promise<ProfesionalResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
};

export const useProfesional = () => {
  const { data, error, isLoading } = useSWR<ProfesionalResponse>(
    "/api/platform/profesional/",
    fetcher
  );

  return { data, error, isLoading };
};

