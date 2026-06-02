import React from "react";
import {
  WebAdminAboutPanel,
  WebAdminArticlesPanel,
  WebAdminGeneralSubAreasPanel,
  WebAdminHeader,
  WebAdminHomePanel,
  WebAdminServicesPanel,
} from "@/components/platform/Victor/webAdmin";
import WebAdminPanelModal from "@/components/platform/Victor/webAdmin/WebAdminPanelModal";

export default function WebAdmin() {
  return (
    <section className='w-full px-4 py-6 md:px-6'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
        <WebAdminHeader />

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
            title='Home'
            description='Slides del carrusel principal del home. Cada slide tiene título, descripción, imagen y enlace opcionales.'
            status='Activo'
            accentClassName='bg-linear-to-r from-(--main-arci) to-(--orange-arci)'
          >
            <WebAdminHomePanel />
          </WebAdminPanelModal>

          <WebAdminPanelModal
            eyebrow='Sección'
            title='About'
            description='Área pensada para administrar el contenido institucional y ordenar cómo se presenta la historia y propuesta de valor.'
            status='Activo'
            accentClassName='bg-linear-to-r from-[#ca8a04] to-[#f59e0b]'
          >
            <WebAdminAboutPanel />
          </WebAdminPanelModal>

          <WebAdminPanelModal
            eyebrow='Sección'
            title='Servicios'
            description='Base para una futura administración comercial del sitio, con foco en servicios, beneficios y recorridos de conversión.'
            status='Activo'
            accentClassName='bg-linear-to-r from-sky-500 to-cyan-400'
          >
            <WebAdminServicesPanel />
          </WebAdminPanelModal>

          <WebAdminPanelModal
            eyebrow='Modulo'
            title='Articulos'
            description='Modulo para administrar articulos con control de activacion por pieza y activacion global de seccion para navbar y pagina publica.'
            status='Activo'
            accentClassName='bg-linear-to-r from-violet-500 to-fuchsia-500'
          >
            <WebAdminArticlesPanel />
          </WebAdminPanelModal>
        </div>
      </div>
    </section>
  );
}
