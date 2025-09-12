import React from "react";
import Image from "next/image";

export default function OfferDetail() {
  return (
    <div className="pt-2">
      <div className='topHat bg-[var(--orange-arci)] w-full h-auto flex align-middle items-center justify-between rounded-t-lg p-2'>
        <div className='flex justify-between items-center align-middle px-4 w-full'>
          <h1 className='font-oswald font-bold text-2xl text-white'>Cirujano</h1>
          <p className='font-Roboto text-xl text-white'>Residente</p>
        </div>
        <Image
          src='https://images.pexels.com/photos/296115/pexels-photo-296115.jpeg'
          className='w-15 h-15 rounded-full'
          width={600}
          height={600}
          objectFit='cover'
          alt='fillImage'
        />
      </div>

      <div className='flex flex-col'>
        <div className='flex justify-between w-full items-center align-middle px-2 pt-2'>
          <h2 className='card-title font-oswald text-2xl text-(--main-arci)'>Clinica FakeName</h2>
          <p className='font-Roboto font-medium'>España - Sada</p>
        </div>

        <p className='description font-roboto-condensed pt-2'>
          Cuidar las Palabras que contengan numeros de telefono, contacto o nombre de la clinica. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam, minima dolorem incidunt veritatis atque, dolor asperiores assumenda quia
          adipisci nostrum distinctio tenetur. Vitae dignissimos atque labore deleniti animi sunt sapiente fugiat dolorum amet accusamus, voluptates saepe illum
          nostrum magni qui, reprehenderit ea doloremque error libero assumenda illo itaque veniam quisquam. Eum, aspernatur rerum. Incidunt obcaecati
          consectetur voluptatum tempora deleniti sed natus veniam, unde officia provident aliquam nesciunt reiciendis animi nostrum tempore adipisci quisquam
          est sint repellat aspernatur hic illo blanditiis ipsam reprehenderit. Repudiandae magni nobis nulla recusandae accusantium sapiente dolorum aperiam
          molestiae, illo labore veritatis. Consequuntur nobis aspernatur quod quibusdam sapiente non debitis, quo praesentium aut labore vero tenetur ut
          ducimus dolores, consequatur excepturi eos omnis at iste. Ex, corporis error! At ea unde perspiciatis ducimus modi aperiam impedit assumenda.
        </p>
        <div className='flex justify-end items-end pt-2'>
          <button className='btn bg-[var(--main-arci)] text-white justify-end'>Aplicar Proceso</button>
        </div>
      </div>
    </div>
  );
}
