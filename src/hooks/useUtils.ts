import { useMemo } from "react"; 

//adjust status
export const useHandleStatusName = (status: string | undefined) => {
    if (status === "inProcess") {
      return "En Proceso";
    } else if (status === "graduated") {
      return "Graduado";
    } else {
      return "No Registrado";
    }
};

//adjust category
export const useHandleCategoryName = (category: string | undefined) => {
    if (category === "doctor") {
      return "Doctor";
    } else if (category === "nurse") {
      return "Enfermero/a";
    } else if (category === "pharmacist") {
      return "Farmacéutico/a";
    } else {
      return "No Registrado";
    }
};
  
export const formatDateToString = (date: string| number | Date ) => { 
    //manejo de fechas
    const fecha = new Date(date);
    const fechaFormateada = fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
    return fechaFormateada;
}

export function useCalcApprovalDate(start_date: string | Date | null | undefined, approval_date?: string | Date | null) {
  return useMemo(() => {
    // Validación de start_date
    if (!start_date) {
      return {
        diasRestantesFormateados: "Fecha de inicio no disponible",
        fechaLimite: null,
        diasExtra: 0,
        plazoDias: 60,
      };
    }

    const fechaAprobado = approval_date ? new Date(approval_date) : null;
    const fechaInicio = new Date(start_date);

    // Validar que la fecha de inicio sea válida
    if (isNaN(fechaInicio.getTime())) {
      return {
        diasRestantesFormateados: "Fecha de inicio inválida",
        fechaLimite: null,
        diasExtra: 0,
        plazoDias: 60,
      };
    }

    let plazoDias = 60;
    let diasExtra = 0;
    let diasRestantesFormateados = "Pendiente de aprobación";

    if (fechaAprobado && !isNaN(fechaAprobado.getTime())) {
      if (fechaInicio > fechaAprobado) {
        const diferencia = Math.ceil((fechaInicio.getTime() - fechaAprobado.getTime()) / (1000 * 3600 * 24));
        diasExtra = diferencia;
      }

      const fechaLimite = new Date(fechaAprobado);
      fechaLimite.setDate(fechaLimite.getDate() + plazoDias + diasExtra);

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const diferenciaTiempo = fechaLimite.getTime() - hoy.getTime();
      const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      diasRestantesFormateados = diasRestantes > 0 ? `${diasRestantes} días restantes` : "Plazo vencido";
    }

    return {
      diasRestantesFormateados,
      fechaLimite: fechaAprobado && !isNaN(fechaAprobado.getTime())
        ? (() => {
            const nuevaFechaLimite = new Date(fechaAprobado);
            nuevaFechaLimite.setDate(nuevaFechaLimite.getDate() + plazoDias + diasExtra);
            return nuevaFechaLimite;
          })()
        : null,
      diasExtra,
      plazoDias,
    };
  }, [start_date, approval_date]);
}

export const useFullName = (name: string | null | undefined, last_name: string | null | undefined) => {
  return useMemo(() => {
    if (!name && !last_name) {
      return '';
    } else if (!name) {
      return last_name;
    } else if (!last_name) {
      return name;
    } else {
      return `${name} ${last_name}`;
    }
  }, [name, last_name]);
};
