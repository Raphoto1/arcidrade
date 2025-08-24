
import { useEffect, useState } from "react";
import { useHandleSubmitText } from "./useFetch";
//confirmar invitacion enviada
export const useChkInvitation = async (id: string) => {
  const [invitation, setInvitation] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("id desde use invitation hook", id);
  const fetchInvitation = async () => {
    const response = await fetch(`/api/auth/invitations/${id}`);
      const data = await response.json();
      console.log("data desde useChkInvitation", data);
    setInvitation(data);
    setLoading(false);
  };
  useEffect(() => {
    console.log('ENTRO AL USEEFFECT DE USE INVITATION');
    
  fetchInvitation();
  }, [id, loading]);
  console.log('invitation desde hook use invitation',invitation);

  return {invitation, loading};
};

// id para test cmekeqy4d0000pg8r3xz08x8l
// generar password segun la invitacion
export const useInvitation = async (form: any, id: string) => {
  console.log("id desde useInvitation", id);
  console.log("form desde useInvitation", form);
  try {
    const result = await useHandleSubmitText(form, `/api/auth/invitations/${id}`);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
