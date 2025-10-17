import { useEffect, useState } from "react";
import { useHandleSubmitText } from "./useFetch";
import useSWR from "swr";

type ResponseType = {
  payload: any; // Idealmente reemplazar con un tipo más preciso
};

const fetcher = async (url: string): Promise<ResponseType> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en la petición");
  }
  return res.json();
};

//confirmar invitacion enviada
export const useChkInvitation = (id: string) => {
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching invitation for ID:', id);
        
        const response = await fetch(`/api/auth/invitations/${id}`);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Invitation data received:', data);
        setInvitation(data);
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        setError(error.message || 'Error al cargar la invitación');
        setInvitation(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvitation();
    } else {
      setLoading(false);
      setError('ID de invitación no proporcionado');
    }
  }, [id]);
  
  return { invitation, loading, error };
};

// id para test cmekeqy4d0000pg8r3xz08x8l
// generar password segun la invitacion
export const useInvitation = async (form: any, id: string) => {
  try {
    const result = await useHandleSubmitText(form, `/api/auth/invitations/${id}`);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useSentInvitations = (status:string) => { 
  const { data, error, isLoading, mutate } = useSWR<ResponseType>(`/api/platform/victor/invitations/?status=${status}`, fetcher);
  return { data, error, isLoading, mutate };
}