"use client";
import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import { PiBooksLight } from "react-icons/pi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Link from "next/link";
import { useSession } from "next-auth/react";

type StepItem = {
  href: string;
  title: string;
  icon: "register" | "documents" | "apply";
};

type StepsProps = {
  forceVisible?: boolean;
  items?: StepItem[];
};

const defaultItems: StepItem[] = [
  { href: "/auth/register", title: "Registrese", icon: "register" },
  { href: "/auth/register", title: "Ingrese Documentos", icon: "documents" },
  { href: "/offers", title: "Aplique", icon: "apply" },
];

function StepIcon({ icon }: { icon: StepItem["icon"] }) {
  if (icon === "register") {
    return <CiCirclePlus size={30} />;
  }

  if (icon === "documents") {
    return <PiBooksLight size={30} />;
  }

  return <HiOutlineBriefcase size={30} />;
}

export default function Steps({ forceVisible = false, items = defaultItems }: StepsProps) {
  const { status } = useSession();
  const shouldShowSteps = forceVisible || status === "unauthenticated";

  // Mostrar loading mientras se verifica la sesión
  if (!forceVisible && status === "loading") {
    return (
      <div className='w-full p-5'>
        <div className='flex w-full flex-col lg:flex-row'>
          <div className='card bg-(--soft-arci) rounded-box grid h-20 md:h-24 grow place-items-center'>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar los pasos si NO está autenticado
  if (shouldShowSteps) {
    return (
      <div className='w-full p-5'>

        <div className='flex w-full flex-col lg:flex-row'>
          {items.map((item, index) => (
            <React.Fragment key={`${item.title}-${index}`}>
              <Link href={item.href} className='card bg-(--soft-arci) rounded-box grid h-20 grow place-items-center transition-all hover:bg-(--main-arci) hover:text-white md:h-24'>
                <StepIcon icon={item.icon} />
                <h3 className='text-xl'>{item.title}</h3>
              </Link>

              {index < items.length - 1 ? <div className='divider lg:divider-horizontal' /> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
