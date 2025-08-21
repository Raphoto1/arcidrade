import { useEffect, useState } from "react"
import { useHandleSubmitText } from "./useFetch";

export const useChkInvitation = (id: string) => {
    const [invitation, setInvitation] = useState(null)
console.log('id desde use', id);

    useEffect(() => {
        const fetchInvitation = async () => {
            const response = await fetch(`/api/auth/invitations/${id}`)
            const data = await response.json()
            setInvitation(data)
        }

        fetchInvitation()
    }, [id])

    return invitation
}

export const useInvitation = async (form: any) => {
    console.log(form);
    try {
        const result = useHandleSubmitText(form, '/api/auth/completeInvitation/')
        console.log(result);
        return true
    } catch (error) {
        console.log(error);
        return false;   
    }
}