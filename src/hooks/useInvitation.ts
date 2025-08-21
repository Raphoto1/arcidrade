import { useEffect, useState } from "react"

export const useInvitation = (id: string) => {
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
