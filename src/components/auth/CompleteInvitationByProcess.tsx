"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { subAreaOptions } from "@/static/data/staticData";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import InstitutionProcessCardPublic from "@/components/pieces/InstitutionProcessCardPublic";

export default function CompleteInvitationByProcess() {
  const router = useRouter();
  const params = useParams() as { id?: string | string[] };
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [processData, setProcessData] = useState<any>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [processError, setProcessError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    sub_area: "",
    accountType: "profesional",
  });

  const processId = useMemo(() => {
    if (typeof params?.id === "string") {
      return params.id;
    }
    if (Array.isArray(params?.id)) {
      return params.id[0];
    }
    return searchParams.get("processId") || searchParams.get("id") || "";
  }, [params, searchParams]);

  useEffect(() => {
    if (!processId) {
      setProcessError("No se encontro el ID del proceso.");
      return;
    }

    let isMounted = true;

    const loadProcess = async () => {
      setProcessLoading(true);
      setProcessError("");

      try {
        const response = await fetch(`/api/public/process/${processId}`);
        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data?.error || "No se pudo cargar el proceso";
          if (response.status === 404) {
            throw new Error("Proceso no encontrado");
          }
          throw new Error(errorMessage);
        }

        if (isMounted) {
          setProcessData(data?.payload || null);
        }
      } catch (error: any) {
        if (isMounted) {
          setProcessError(error.message || "No se pudo cargar el proceso");
        }
      } finally {
        if (isMounted) {
          setProcessLoading(false);
        }
      }
    };

    loadProcess();

    return () => {
      isMounted = false;
    };
  }, [processId]);

  const handleProcessNotFoundConfirm = () => {
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!processId) {
      alert("No se encontro el ID del proceso.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const nameToValidate = formData.nombre;

    if (nameToValidate.trim()) {
      const trimmedName = nameToValidate.trim();

      const validCharsPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
      if (!validCharsPattern.test(trimmedName)) {
        alert("El nombre solo debe contener letras, espacios, guiones y apostrofes.");
        return;
      }

      const hasVowel = /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(trimmedName);
      if (!hasVowel) {
        alert("El nombre ingresado no parece valido. Por favor ingresa un nombre real.");
        return;
      }

      const tooManyConsonants = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(trimmedName);
      if (tooManyConsonants) {
        alert("El nombre ingresado no parece valido. Demasiadas consonantes consecutivas.");
        return;
      }

      const suspiciousPattern = /([a-z][A-Z]|[A-Z][a-z]){3,}/;
      if (suspiciousPattern.test(trimmedName)) {
        alert("El nombre tiene un formato sospechoso. Por favor ingresa un nombre con formato estandar.");
        return;
      }

      const lettersOnly = trimmedName.replace(/[^a-zA-Z]/g, "");
      const uppercaseRatio = (lettersOnly.match(/[A-Z]/g) || []).length / lettersOnly.length;
      if (uppercaseRatio > 0.35 && lettersOnly.length > 3) {
        alert("El nombre tiene demasiadas mayusculas. Por favor usa formato estandar.");
        return;
      }

      if (lettersOnly.length < 2) {
        alert("El nombre debe tener al menos 2 letras.");
        return;
      }

      const repeatedSymbols = /[-']{2,}/.test(trimmedName);
      if (repeatedSymbols) {
        alert("El nombre tiene simbolos repetidos. Por favor verifica el formato.");
        return;
      }
    }

    if (!formData.nombre.trim()) {
      alert("Por favor ingrese su nombre completo");
      return;
    }
    if (!formData.sub_area) {
      alert("Por favor seleccione una categoria profesional");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        accountType: "profesional",
        processId,
      };
      payload.nombre = formData.nombre;
      payload.sub_area = formData.sub_area;
      payload.institutionName = "";

      const response = await fetch("/api/auth/register-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear cuenta");
      }

      alert("Cuenta creada exitosamente. Ahora puedes iniciar sesion.");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8 relative'>
      {processError === "Proceso no encontrado" && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'>
          <div className='alert alert-error shadow-lg max-w-lg w-full'>
            <span>Proceso no encontrado. Verifica el link e intenta de nuevo.</span>
            <div className='flex gap-2'>
              <button type='button' className='btn btn-sm' onClick={handleProcessNotFoundConfirm}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 w-full max-w-6xl px-4'>
        <div className='flex justify-center items-center p-2 order-2 lg:order-1'>
          <div className='flex-col justify-start h-full bg-gray-200 w-full align-middle items-center rounded-sm p-6 md:justify-center'>
            <div className='text-center mt-4 flex flex-col gap-3'>
              <button
                type='button'
                onClick={() => router.push("/auth/login")}
                className='text-xl font-semibold text-(--main-arci) hover:text-(--soft-arci) hover:underline transition-colors'
              >
                ¿Ya tienes cuenta? Inicia sesion
              </button>
              <button
                type='button'
                onClick={() => router.push("/auth/genInvitation")}
                className='text-xl font-semibold text-(--main-arci) hover:text-(--soft-arci) hover:underline transition-colors'
              >
                ¿Recibiste una invitacion? Completala aqui
              </button>
            </div>

            <h2 className='text-2xl font-bold text-start font-var(--font-oswald) mb-2'>
              Registrarse para aplicar al Proceso: {processData?.position || "un proceso"}
            </h2>
            <p className='text-sm text-(--dark-gray) mb-4'>
              Completa tus datos para postularte.
            </p>

            <form onSubmit={handleSubmit} className='form justify-center align-middle'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='mb-2'>
                  <label htmlFor='email' className='block text-sm font-medium mb-2'>
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    required
                  />
                </div>

                <div className='mb-2'>
                  <label htmlFor='password' className='block text-sm font-medium mb-2'>
                    Contraseña *
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? "text" : "password"}
                      name='password'
                      id='password'
                      value={formData.password}
                      onChange={handleChange}
                      className='input input-bordered w-full pr-12'
                      required
                      minLength={6}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700'
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className='h-5 w-5' />
                      ) : (
                        <AiOutlineEye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>

                <div className='mb-2 md:col-span-2'>
                  <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                    Confirmar Contraseña *
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name='confirmPassword'
                      id='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='input input-bordered w-full pr-12'
                      required
                      minLength={6}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700'
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible className='h-5 w-5' />
                      ) : (
                        <AiOutlineEye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>

                <div className='mb-2 md:col-span-2'>
                  <label htmlFor='nombre' className='block text-sm font-medium mb-2'>
                    Nombre *
                  </label>
                  <input
                    type='text'
                    name='nombre'
                    id='nombre'
                    value={formData.nombre}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    required
                  />
                </div>

                <div className='mb-2 md:col-span-2'>
                  <label htmlFor='sub_area' className='block text-sm font-medium mb-2'>
                    Categoria Profesional *
                  </label>
                  <select
                    name='sub_area'
                    id='sub_area'
                    value={formData.sub_area}
                    onChange={handleChange}
                    className='select select-bordered w-full'
                    required
                  >
                    <option value=''>Seleccione una categoria</option>
                    {subAreaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 justify-center gap-2 items-center align-middle mt-6'>
                <button
                  className='btn btn-wide bg-(--main-arci) text-white hover:bg-(--soft-arci) font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className='loading loading-spinner loading-sm'></span>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    "📝 Registrarse"
                  )}
                </button>
                <button
                  type='button'
                  className='btn btn-wide bg-(--orange-arci) text-white hover:bg-orange-600'
                  onClick={() => router.push("/")}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className='flex justify-center lg:justify-start items-start order-1 lg:order-2'>
          <div className='w-full flex justify-center'>
            {processLoading && (
              <div className='p-6 text-center text-sm text-(--dark-gray)'>
                Cargando proceso...
              </div>
            )}
            {!processLoading && processError && (
              <div className='p-6 text-center text-sm text-red-600'>{processError}</div>
            )}
            {!processLoading && !processError && processData && (
              <InstitutionProcessCardPublic
                processData={processData}
                showRegisterCta={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
