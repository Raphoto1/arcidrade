export const useProfesional = async (id:string) => {
    const response = await fetch(`/api/platform/profesional/${id}`);
    const data = await response.json();
    return data;
}
