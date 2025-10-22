import React, { useState, useMemo, useEffect, useRef } from "react";


import { useAllCompletedProcesses } from "@/hooks/useProcess";
import ProcessVictor from "./pieces/ProcessVictor";
import { useInstitutionById } from "@/hooks/usePlatInst";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "./AdminProcess";

// Componente auxiliar para mostrar cada proceso con información del cliente
function ProcessDropdownItem({ process, onSelect, isSelected }: { process: any; onSelect: (process: any) => void; isSelected: boolean }) {
  const { data: institutionPack } = useInstitutionById(process.user_id || "");
  const institutionData = institutionPack?.payload;

  return (
    <li>
      <button className={`text-left p-3 hover:bg-base-200 rounded-lg w-full ${isSelected ? "bg-base-200" : ""}`} onClick={() => onSelect(process)}>
        <div className='flex flex-col'>
          <span className='font-semibold text-[var(--main-arci)]'>{process.position}</span>
          <span className='text-sm font-medium text-gray-700'>Cliente: {institutionData?.name || "Cargando cliente..."}</span>
          <span className='text-sm text-gray-600'>Especialidad: {process.main_speciality}</span>
          <span className='text-xs text-gray-500'>Estado: {process.status || "Finalizado"}</span>
        </div>
      </button>
    </li>
  );
}

// Componente auxiliar para mostrar el proceso seleccionado en el botón
function SelectedProcessDisplay({ process }: { process: any }) {
  const { data: institutionPack } = useInstitutionById(process.user_id || "");
  const institutionData = institutionPack?.payload;

  return (
    <div className='flex flex-col'>
      <span className='font-semibold'>{process.position}</span>
      <span className='text-sm text-gray-600'>{institutionData?.name || "Cargando cliente..."}</span>
    </div>
  );
}

export default function FinishedProcess() {
  const { data, error, isLoading, mutate } = useAllCompletedProcesses();
  const completedProcesses = data?.payload || [];
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [institutionFilter, setInstitutionFilter] = useState<string>("");

  // Estado para almacenar información de instituciones cargadas
  const [institutionsData, setInstitutionsData] = useState<{ [key: string]: string }>({});

  // Estado para el loader del proceso seleccionado
  const [isLoadingProcess, setIsLoadingProcess] = useState<boolean>(false);

  // Estados para controlar dropdowns
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  
  // Estado para controlar si el contenido completo está expandido
  const [isContentExpanded, setIsContentExpanded] = useState<boolean>(false);

  // Referencias a los dropdowns
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar procesos válidos
  const validProcesses = completedProcesses.filter((process: any) => process && process.id);

  // Componente auxiliar para cargar información de institución
  const InstitutionDataLoader = ({ userId }: { userId: string }) => {
    const { data } = useInstitutionById(userId);

    useEffect(() => {
      if (data?.payload?.name && !institutionsData[userId]) {
        setInstitutionsData((prev) => ({
          ...prev,
          [userId]: data.payload.name,
        }));
      }
    }, [data, userId]);

    return null;
  };

  // Obtener user_ids únicos para cargar información de instituciones
  const uniqueUserIds = useMemo(() => {
    return [...new Set(validProcesses.map((p: any) => p.user_id).filter(Boolean))];
  }, [validProcesses]);

  // Filtrar procesos por institución seleccionada
  const filteredProcesses = useMemo(() => {
    if (!institutionFilter) return validProcesses;

    return validProcesses.filter((process: any) => {
      const institutionName = institutionsData[process.user_id];
      return institutionName && institutionName.toLowerCase().includes(institutionFilter.toLowerCase());
    });
  }, [validProcesses, institutionFilter, institutionsData]);

  // Obtener lista de instituciones únicas para el select
  const availableInstitutions = useMemo(() => {
    const institutions = Object.values(institutionsData).filter(Boolean);
    return [...new Set(institutions)].sort();
  }, [institutionsData]);

  const handleProcessSelect = (process: any) => {
    setIsLoadingProcess(true);
    setSelectedProcess(process);
    setIsDropdownOpen(false);

    // Forzar el cierre del dropdown usando la referencia
    if (dropdownRef.current) {
      dropdownRef.current.classList.remove("dropdown-open");
      const button = dropdownRef.current.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.blur();
      }
    }

    // Simular un pequeño delay para mostrar el loader
    setTimeout(() => {
      setIsLoadingProcess(false);
    }, 800);
  };

  const handleFilterSelect = (institution: string) => {
    setInstitutionFilter(institution);
    setIsFilterDropdownOpen(false);

    // Forzar el cierre del dropdown del filtro
    if (filterDropdownRef.current) {
      filterDropdownRef.current.classList.remove("dropdown-open");
      const button = filterDropdownRef.current.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.blur();
      }
    }
  };

  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1 gap-4 mt-4 pt-0 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center md:w-4/5 bg-gray-100'>
        {/* Header clickeable con título y botón */}
        <div 
          className={`flex md:justify-around flex-col md:flex-row bg-gray-300 p-2 cursor-pointer hover:bg-gray-400 transition-colors ${isContentExpanded ? 'rounded-t-md' : 'rounded-md'}`}
          onClick={() => setIsContentExpanded(!isContentExpanded)}
        >
          <div className='flex items-center gap-2'>
            <svg
              className={`w-5 h-5 fill-current transition-transform duration-200 ${isContentExpanded ? "rotate-90" : ""}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'>
              <path d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' />
            </svg>
          </div>
          <h2 className='text-2xl fontArci text-center flex-1'>Procesos Finalizados ({validProcesses.length})</h2>
          <div onClick={(e) => e.stopPropagation()}>
            <ModalForPreview title='Administrar Procesos'>
              <AdminProcess />
            </ModalForPreview>
          </div>
        </div>
        
        {/* Contenido expandible */}
        {isContentExpanded && (
          <>
        {/* Estados de carga y error */}
        {isLoading && (
          <div className='flex justify-center items-center p-8'>
            <div className='loading loading-spinner loading-lg'></div>
            <span className='ml-2'>Cargando procesos finalizados...</span>
          </div>
        )}

        {error && (
          <div className='alert alert-error max-w-md mx-auto'>
            <p>Error al cargar los procesos finalizados</p>
          </div>
        )}

        {/* Controles superiores - Dropdown y Filtro */}
        {!isLoading && !error && validProcesses.length > 0 && (
          <div className='w-full p-4 pb-2'>
            <div className='flex flex-col md:flex-row gap-3 md:gap-4 md:items-center'>
              {/* Dropdown de procesos */}
              <div className='flex-1 w-full md:w-auto'>
                <div ref={dropdownRef} className={`dropdown dropdown-bottom w-full relative z-50 ${isDropdownOpen ? "dropdown-open" : ""}`}>
                  <div tabIndex={0} role='button' className='btn btn-outline w-full justify-between' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span className='text-left'>
                      {selectedProcess ? <SelectedProcessDisplay process={selectedProcess} /> : "Seleccionar proceso para ver detalles"}
                    </span>
                    <svg
                      className={`w-4 h-4 fill-current transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'>
                      <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className='dropdown-content z-[9999] menu p-2 shadow-2xl bg-base-100 rounded-box w-full max-h-60 overflow-auto border border-gray-200'>
                    {filteredProcesses.map((process: any) => (
                      <ProcessDropdownItem key={process.id} process={process} onSelect={handleProcessSelect} isSelected={selectedProcess?.id === process.id} />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Filtro dropdown por institución */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto md:flex-shrink-0'>
                <span className='text-sm font-medium text-gray-600'>Filtrar por institución:</span>
                <div className='flex items-center gap-2'>
                  <div ref={filterDropdownRef} className={`dropdown dropdown-bottom relative z-40 ${isFilterDropdownOpen ? "dropdown-open" : ""}`}>
                    <div
                      tabIndex={0}
                      role='button'
                      className='btn btn-outline btn-sm w-full sm:w-48 justify-between text-sm'
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}>
                      <span className='text-left truncate'>{institutionFilter || "Todas las instituciones"}</span>
                      <svg
                        className={`w-3 h-3 fill-current transition-transform duration-200 ${isFilterDropdownOpen ? "rotate-180" : ""}`}
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'>
                        <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className='dropdown-content z-[9998] menu p-2 shadow-xl bg-base-100 rounded-box w-full max-h-48 overflow-auto border border-gray-200'>
                      <li>
                        <button
                          className={`text-left p-2 hover:bg-base-200 rounded-lg w-full ${!institutionFilter ? "bg-base-200 font-semibold" : ""}`}
                          onClick={() => handleFilterSelect("")}>
                          <span className='text-sm'>Todas las instituciones</span>
                        </button>
                      </li>
                      <div className='divider my-1'></div>
                      {availableInstitutions.map((institution) => (
                        <li key={institution}>
                          <button
                            className={`text-left p-2 hover:bg-base-200 rounded-lg w-full ${
                              institutionFilter === institution ? "bg-base-200 font-semibold" : ""
                            }`}
                            onClick={() => handleFilterSelect(institution)}>
                            <span className='text-sm truncate'>{institution}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className='text-xs text-gray-500'>({filteredProcesses.length})</span>
                  {institutionFilter && (
                    <button className='btn btn-ghost btn-xs' onClick={() => handleFilterSelect("")} title='Limpiar filtro'>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Área de contenido del proceso */}
        {!isLoading && !error && (
          <div className='w-full px-4 pb-4 relative'>
            {validProcesses.length > 0 ? (
              <>
                {filteredProcesses.length > 0 ? (
                  <>
                    {/* Mostrar detalles del proceso seleccionado o loader */}
                    {selectedProcess && (
                      <div className='relative z-10'>
                        {isLoadingProcess ? (
                          <div className='card bg-base-100 shadow-lg'>
                            <div className='card-body'>
                              <div className='flex flex-col items-center justify-center py-8'>
                                <div className='loading loading-spinner loading-lg text-primary mb-4'></div>
                                <p className='text-lg font-medium text-gray-600'>Cargando detalles del proceso...</p>
                                <p className='text-sm text-gray-400 mt-1'>Esto puede tomar unos segundos</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <ProcessVictor key={selectedProcess.id} id={selectedProcess.id} isFake={false} />
                        )}
                      </div>
                    )}

                    {!selectedProcess && (
                      <div className='text-center p-12'>
                        <div className='flex flex-col items-center gap-4'>
                          <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                            />
                          </svg>
                          <p className='text-gray-500 text-xl'>Selecciona un proceso para ver sus detalles</p>
                          <p className='text-gray-400 text-sm'>Usa el menú desplegable de arriba para elegir un proceso</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-center p-12'>
                    <div className='flex flex-col items-center gap-4'>
                      <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                      <p className='text-gray-500 text-xl'>No hay procesos que coincidan con el filtro</p>
                      <p className='text-gray-400 text-sm'>Prueba seleccionando "Todas las instituciones" o cambia el filtro</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='text-center p-12'>
                <div className='flex flex-col items-center gap-4'>
                  <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                  <p className='text-gray-500 text-xl'>No hay procesos finalizados</p>
                  <p className='text-gray-400 text-sm'>Los procesos finalizados aparecerán aquí</p>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>

      {/* Cargar datos de instituciones para todos los user_ids únicos */}
      {uniqueUserIds
        .filter((userId: any) => !institutionsData[userId])
        .map((userId: any) => (
          <InstitutionDataLoader key={userId as string} userId={userId as string} />
        ))}
    </div>
  );
}
