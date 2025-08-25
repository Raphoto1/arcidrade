import { useEffect, useState } from "react";
import { useHandleSubmitText } from "./useFetch";
//confirmar invitacion enviada
export const useChkInvitation = async (id: string) => {
  const [invitation, setInvitation] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchInvitation = async () => {
    const response = await fetch(`/api/auth/invitations/${id}`);
    const data = await response.json();
    setInvitation(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchInvitation();
  }, [id, loading]);
  return { invitation, loading };
};

// id para test cmekeqy4d0000pg8r3xz08x8l
// generar password segun la invitacion
export const useInvitation = async (form: any, id: string) => {
  console.log('Datos recibidos en useInvitation:', { form, id });

  try {
    const result = await useHandleSubmitText(form, `/api/auth/invitations/${id}`);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
