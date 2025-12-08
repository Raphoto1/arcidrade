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
        const response = await fetch(`/api/auth/invitations/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
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
    return true;
  } catch (error) {
    throw error;
  }
};

// reset password para usuarios ya registrados
export const useResetPassword = async (form: any, id: string) => {
  try {
    const result = await useHandleSubmitText(form, `/api/auth/resetPassword/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
};

// solicitar reset password por email
export const useForgotPassword = async (email: string) => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar email de recuperación');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const useSentInvitations = (status:string) => { 
  const { data, error, isLoading, mutate } = useSWR<ResponseType>(`/api/platform/victor/invitations/?status=${status}`, fetcher);
  return { data, error, isLoading, mutate };
}
