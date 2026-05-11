"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiLayers, FiLayout, FiMonitor } from "react-icons/fi";

type DbStatusResponse = {
  status?: string;
  totalTime?: string;
};

export default function WebAdminHeader() {
  const [isCheckingDb, setIsCheckingDb] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbLatency, setDbLatency] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkDbStatus = async () => {
      try {
        const response = await fetch("/api/db-status", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as DbStatusResponse;
        const isHealthy = response.ok && data?.status === "healthy";

        if (!isMounted) return;

        setDbConnected(isHealthy);
        setDbLatency(typeof data?.totalTime === "string" ? data.totalTime : null);
      } catch {
        if (!isMounted) return;
        setDbConnected(false);
        setDbLatency(null);
      } finally {
        if (isMounted) {
          setIsCheckingDb(false);
        }
      }
    };

    checkDbStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const dbStat = useMemo(() => {
    if (isCheckingDb) {
      return {
        value: "Verificando DB...",
        note: "Corriendo test de conexión",
      };
    }

    if (dbConnected) {
      return {
        value: "DB conectada",
        note: dbLatency ? `Test OK · ${dbLatency}` : "Test OK",
      };
    }

    return {
      value: "Sin conexión DB",
      note: "Falló test de conexión",
    };
  }, [dbConnected, dbLatency, isCheckingDb]);

  const stats = [
    { label: "Secciones editables", value: "4", note: "Home · About · Servicios · Artículos", icon: FiLayout },
    { label: "Estado actual de Base de datos", value: dbStat.value, note: dbStat.note, icon: FiMonitor },
    { label: "Próxima etapa", value: "Blob", note: "assets", icon: FiLayers },
  ];

  return (
    <header className='overflow-hidden rounded-4xl bg-linear-to-r from-(--main-arci) via-(--main-arci) to-(--orange-arci) text-white shadow-lg'>
      <div className='flex flex-wrap items-center gap-4 px-6 py-5 md:px-8'>
        <div className='mr-auto'>
          <span className='inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]'>
            Web Admin
          </span>
          <h1 className='mt-2 font-oswald text-3xl leading-tight'>Dashboard</h1>
        </div>

        <div className='flex flex-wrap gap-3'>
          {stats.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className='flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm'>
              <div className='rounded-xl bg-white/15 p-1.5 shrink-0'>
                <Icon size={16} />
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.15em] text-white/65'>{label}</p>
                <p className='font-oswald text-base leading-tight'>{value}</p>
                <p className='text-[11px] leading-tight text-white/60'>{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}