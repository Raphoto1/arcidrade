import React from "react";

export default function ProfesionalProfileForm() {
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
          <form onSubmit={handleSubmit} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block'>
              <label htmlFor='name' className='block'>
                Nombre/s
              </label>
              <input type='text' name='name' />
            </div>
            <div>
              <label htmlFor='last_name' className='block'>
                Apellido/s
              </label>
              <input type='text' name='last_name' />
            </div>
            <div>
              <label htmlFor='birth_date' className='block'>
                Fecha de nacimiento
              </label>
              <input type='date' name='birth_date' />
            </div>
            <div>
              <label htmlFor='last_name' className='block'>
                Email
              </label>
              <input type='email' name='email' />
            </div>
            <div>
              <label htmlFor='phone' className='block'>
                Telefono o celular de contacto
              </label>
              <input type='text' name='phone' />
            </div>
            <div>
              <label htmlFor='country' className='block'>
                Pais de Nacionalidad
              </label>
              <input type='text' name='country' />
            </div>
            <div>
              <label htmlFor='state' className='block'>
                Estado de Nacionalidad
              </label>
              <input type='text' name='state' />
            </div>
            <div>
              <label htmlFor='city' className='block'>
                Ciudad de Nacionalidad
              </label>
              <input type='text' name='city' />
            </div>
            <div>
              <label htmlFor='title' className='block'>
                Estudio Principal
              </label>
              <input type='text' name='title' />
            </div>
            <div>
              <label htmlFor='titleCountry' className='block'>
                Pais del estudio Principal
              </label>
              <input type='text' name='titleCountry' />
            </div>
            <div>
              <label htmlFor='titleInstitution' className='block'>
                Institucion que otorga el titulo
              </label>
              <input type='text' name='titleInstitution' />
            </div>
            <div>
              <label htmlFor='titleStatus' className='block'>
                Estado del titulo
              </label>
              <input type='text' name='titleStatus' />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Confirmar datos personales
              </button>
              <button className='btn btn-wide bg-[var(--orange-arci)]'>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
