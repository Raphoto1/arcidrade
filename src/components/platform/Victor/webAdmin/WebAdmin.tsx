import React from "react";
import { FiFileText, FiGrid, FiPenTool } from "react-icons/fi";
import {
  WebAdminAboutPanel,
  WebAdminArticlesPanel,
  WebAdminGeneralSubAreasPanel,
  WebAdminHeader,
  WebAdminHomePanel,
  WebAdminServicesPanel,
} from "@/components/platform/Victor/webAdmin";
import WebAdminPanelModal from "@/components/platform/Victor/webAdmin/WebAdminPanelModal";

const futureModules = [
  {
    title: "Hero y bloques principales",
    description: "Gestionar titulares, llamados a la acción, grids destacados y orden visual del home.",
    icon: FiGrid,
  },
  {
    title: "Narrativa institucional",
    description: "Editar historia, enfoque, diferenciales y bloques explicativos de About.",
    icon: FiFileText,
  },
  {
    title: "Oferta comercial",
    description: "Preparar fichas, categorías y textos de Servicios con estructura reutilizable.",
    icon: FiPenTool,
  },
];

export default function WebAdmin() {
  return (
    <section className='w-full px-4 py-6 md:px-6'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
        <WebAdminHeader />

        <div className='grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]'>
          <div className='grid gap-4 md:grid-cols-2'>
            <WebAdminPanelModal
              eyebrow='Plataforma'
              title='Sub-Áreas Profesional General'
              description='Categorías disponibles para los profesionales de tipo General. El usuario selecciona una al completar su perfil.'
              status='Activo'
              accentClassName='bg-linear-to-r from-violet-500 to-purple-400'
            >
              <WebAdminGeneralSubAreasPanel />
            </WebAdminPanelModal>

            <WebAdminPanelModal
              eyebrow='Sección'
              title='Home — Carrusel'
              description='Slides del carrusel principal del home. Cada slide tiene título, descripción, imagen y enlace opcionales.'
              status='En desarrollo'
              accentClassName='bg-linear-to-r from-(--main-arci) to-(--orange-arci)'
            >
              <WebAdminHomePanel />
            </WebAdminPanelModal>

            <WebAdminPanelModal
              eyebrow='Sección'
              title='About'
              description='Área pensada para administrar el contenido institucional y ordenar cómo se presenta la historia y propuesta de valor.'
              status='En desarrollo'
              accentClassName='bg-linear-to-r from-[#ca8a04] to-[#f59e0b]'
            >
              <WebAdminAboutPanel />
            </WebAdminPanelModal>

            <WebAdminPanelModal
              eyebrow='Sección'
              title='Servicios'
              description='Base para una futura administración comercial del sitio, con foco en servicios, beneficios y recorridos de conversión.'
              status='En desarrollo'
              accentClassName='bg-linear-to-r from-sky-500 to-cyan-400'
            >
              <WebAdminServicesPanel />
            </WebAdminPanelModal>

            <WebAdminPanelModal
              eyebrow='Futuro módulo'
              title='Artículos'
              description='Componente visual inicial para el futuro CMS editorial del blog o sección de contenido publicada.'
              status='En desarrollo'
              accentClassName='bg-linear-to-r from-violet-500 to-fuchsia-500'
            >
              <WebAdminArticlesPanel />
            </WebAdminPanelModal>
          </div>

          <aside className='rounded-3xl border border-gray-200 bg-linear-to-br from-white via-gray-50 to-(--soft-arci) p-6 shadow-sm'>
            <div className='max-w-sm'>
              <span className='inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--main-arci)'>
                Roadmap
              </span>
              <h2 className='mt-4 font-oswald text-3xl text-(--main-arci)'>Centro de edición web</h2>
              <p className='mt-3 text-sm leading-6 text-gray-600'>
                Este dashboard ya deja definida la arquitectura visual para administrar el contenido estático del sitio.
                El siguiente paso será convertir cada bloque en editor real con persistencia, versionado y carga de archivos.
              </p>
            </div>

            <div className='mt-6 space-y-3'>
              {futureModules.map(({ title, description, icon: Icon }) => (
                <article key={title} className='rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-xl bg-(--soft-arci) p-2 text-(--main-arci)'>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-(--main-arci)'>{title}</h3>
                      <p className='mt-1 text-sm leading-6 text-gray-600'>{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
