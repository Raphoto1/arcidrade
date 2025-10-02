import useSWR from "swr";

type ProfesionalResponse = {
  payload: any; // Idealmente reemplazar con un tipo más preciso
};

const fetcher = async (url: string): Promise<ProfesionalResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en la petición");
  }
  return res.json();
};

export const useInstitution = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/", fetcher);

  return { data, error, isLoading, mutate };
};

export const useInstitutionSpecializations = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/speciality", fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionSpeciality = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/speciality/${id}` : null, fetcher);
  return { data, error, isLoading, mutate };
}