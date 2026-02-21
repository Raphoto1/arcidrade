import React from "react";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  color?: "primary" | "secondary" | "accent" | "neutral" | "info" | "success" | "warning" | "error";
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({ 
  size = "md", 
  text = "Cargando...", 
  color = "primary",
  fullScreen = false,
  className = ""
}: LoaderProps) {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg"
  };

  const colorClass = color !== "primary" ? `text-${color}` : "text-[var(--main-arci)]";

  const content = (
    <div className={`flex flex-col justify-center items-center gap-3 ${className}`}>
      <div className={`loading loading-spinner ${sizeClasses[size]} ${colorClass}`}></div>
      {text && <span className="text-sm font-medium text-gray-600">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Componente para usar en línea (inline)
export function InlineLoader({ 
  size = "sm", 
  color = "primary" 
}: Omit<LoaderProps, "text" | "fullScreen" | "className">) {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg"
  };

  const colorClass = color !== "primary" ? `text-${color}` : "text-[var(--main-arci)]";

  return <span className={`loading loading-spinner ${sizeClasses[size]} ${colorClass}`}></span>;
}

// Componente para estados de carga en cards
export function CardLoader({ text = "Cargando..." }: Pick<LoaderProps, "text">) {
  return (
    <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
      <Loader size="md" text={text} />
    </div>
  );
}

// Componente para estados de carga en páginas completas
export function PageLoader({ text = "Cargando..." }: Pick<LoaderProps, "text">) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader size="lg" text={text} />
    </div>
  );
}

// Componente skeleton card loader (ghost effect)
export function SkeletonCardLoader() {
  return (
    <div className="card w-96 bg-base-100 card-sm shadow-sm max-w-80 animate-pulse">
      <div className="topHat bg-gray-300 w-full h-20 rounded-t-lg"></div>
      <div className="card-body space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="flex justify-between items-end pt-4">
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
