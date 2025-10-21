import React from "react";

import Grid from "../pieces/Grid";
import InstitutionCard from "@/components/pieces/InstitutionCard";
import { useActiveProcessesByUser } from "@/hooks/useProcess";
import { useProfesional } from "@/hooks/usePlatPro";
import { useSession } from "next-auth/react";
import InstitutionProcessCard from "@/components/pieces/InstitutionProcessCard";
export default function MyAplications() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data } = useActiveProcessesByUser(userId || null);
  const processData = data?.payload[0]
  
  // Filtrar solo los procesos agregados por profesional
  const profesionalApplications = data?.payload?.filter((process: any) => process.added_by === "profesional") || [];
  

  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Mis Postulaciones</h2>
      <div className="w-full min-w-full flex justify-center">
        
        <Grid>
          {profesionalApplications.length > 0 ? (
            profesionalApplications.map((process: any, index: number) => (
              <InstitutionProcessCard key={process.id || index} processId={process.process_id} isFake={true} btnActive={false} />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-8">
              <p className="text-xl text-gray-500 fontArci text-center">
                Aún no has aplicado a ninguna oferta
              </p>
            </div>
          )}
        </Grid>
      </div>
    </div>
  );
}
