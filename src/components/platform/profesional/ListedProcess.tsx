import React from "react";

import Grid from "../pieces/Grid";
import InstitutionCard from "@/components/pieces/InstitutionCard";
import { useActiveProcessesByUser } from "@/hooks/useProcess";
import { useProfesional } from "@/hooks/usePlatPro";
import { useSession } from "next-auth/react";
import InstitutionProcessCard from "@/components/pieces/InstitutionProcessCard";
export default function ListedProcess() {
  const { data: session } = useSession()
  const userId = session?.user.id
  const { data } = useActiveProcessesByUser(userId || null);
  const processData = data?.payload[0]
  console.log('users aplications', data);
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Procesos en que aparezco</h2>
      <div className="w-full min-w-full flex justify-center">
        
      <Grid>
        {data?.payload.map((process: any, index:number) => (
          <InstitutionProcessCard key={process.id || index} processId={process.process_id} isFake={true} />
        ))}
      </Grid>
      </div>
    </div>
  );
}
