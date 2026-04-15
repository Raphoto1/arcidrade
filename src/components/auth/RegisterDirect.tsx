"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { subAreaOptions } from '@/static/data/staticData';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface GeneralSubArea {
  id: number;
  sub_area: string;
}

export default function RegisterDirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalSubAreas, setGeneralSubAreas] = useState<GeneralSubArea[]>([]);
  const [loadingSubAreas, setLoadingSubAreas] = useState(false);
  const [subAreasUnavailable, setSubAreasUnavailable] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    sub_area: '',
    accountType: 'profesional',
    institutionName: ''
  });

  useEffect(() => {
    if (formData.accountType !== 'profesional_general') return;
    setSubAreasUnavailable(false);
    setLoadingSubAreas(true);
    fetch('/api/auth/general-subareas')
      .then((r) => r.json())
      .then((json) => {
        if (json.payload && json.payload.length > 0) {
          setGeneralSubAreas(json.payload);
        } else {
          // Sin categorías configuradas aún — fallback a 'general'
          setSubAreasUnavailable(true);
          setFormData(prev => ({ ...prev, sub_area: 'general' }));
        }
      })
      .catch(() => {
        // Error de red o servidor — fallback silencioso a 'general'
        setSubAreasUnavailable(true);
        setFormData(prev => ({ ...prev, sub_area: 'general' }));
      })
      .finally(() => setLoadingSubAreas(false));
  }, [formData.accountType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!acceptedTerms) {
      alert('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validación de nombre sospechoso (demasiadas mayúsculas/minúsculas mezcladas)
    const nameToValidate = formData.accountType === 'institution' 
      ? formData.institutionName 
      : formData.nombre;

    if (nameToValidate.trim()) {
      const trimmedName = nameToValidate.trim();
      
      // 1. Solo permite letras (con acentos), espacios, guiones y apóstrofes
      const validCharsPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
      if (!validCharsPattern.test(trimmedName)) {
        alert('El nombre solo debe contener letras, espacios, guiones y apóstrofes.');
        return;
      }

      // 2. Debe tener al menos una vocal (nombres reales siempre tienen vocales)
      const hasVowel = /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(trimmedName);
      if (!hasVowel) {
        alert('El nombre ingresado no parece válido. Por favor ingresa un nombre real.');
        return;
      }

      // 3. No permite más de 3 consonantes seguidas (español/inglés típicamente max 3)
      const tooManyConsonants = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(trimmedName);
      if (tooManyConsonants) {
        alert('El nombre ingresado no parece válido. Demasiadas consonantes consecutivas.');
        return;
      }

      // 4. Detecta patrones sospechosos de mayúsculas/minúsculas mezcladas (3+ cambios)
      const suspiciousPattern = /([a-z][A-Z]|[A-Z][a-z]){3,}/;
      if (suspiciousPattern.test(trimmedName)) {
        alert('El nombre tiene un formato sospechoso. Por favor ingresa un nombre con formato estándar.');
        return;
      }

      // 5. Ratio de mayúsculas (máximo 35% del nombre)
      const lettersOnly = trimmedName.replace(/[^a-zA-Z]/g, '');
      const uppercaseRatio = (lettersOnly.match(/[A-Z]/g) || []).length / lettersOnly.length;
      if (uppercaseRatio > 0.35 && lettersOnly.length > 3) {
        alert('El nombre tiene demasiadas mayúsculas. Por favor usa formato estándar.');
        return;
      }

      // 6. Mínimo 2 caracteres de letras (sin contar espacios/símbolos)
      if (lettersOnly.length < 2) {
        alert('El nombre debe tener al menos 2 letras.');
        return;
      }

      // 7. No permite más de un símbolo seguido (guión, apóstrofe)
      const repeatedSymbols = /[-']{2,}/.test(trimmedName);
      if (repeatedSymbols) {
        alert('El nombre tiene símbolos repetidos. Por favor verifica el formato.');
        return;
      }
    }

    if (formData.accountType === 'institution') {
      if (!formData.institutionName.trim()) {
        alert('Por favor ingrese el nombre de la institución');
        return;
      }
    } else if (formData.accountType === 'profesional_general') {
      if (!formData.nombre.trim()) {
        alert('Por favor ingrese su nombre completo');
        return;
      }
      // sub_area es opcional cuando no hay categorías disponibles (fallback a 'general')
      if (!subAreasUnavailable && generalSubAreas.length > 0 && !formData.sub_area) {
        alert('Por favor seleccione una categoría profesional');
        return;
      }
    } else {
      // Validaciones para profesional de la salud
      if (!formData.nombre.trim()) {
        alert('Por favor ingrese su nombre completo');
        return;
      }
      if (!formData.sub_area) {
        alert('Por favor seleccione una categoría profesional');
        return;
      }
    }

    setLoading(true);
    
    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
        termsAccepted: acceptedTerms,
      };

      if (formData.accountType === 'institution') {
        payload.institutionName = formData.institutionName;
        payload.nombre = formData.institutionName; // Usar nombre institución como nombre
        payload.sub_area = ''; // Vacío para institución
      } else if (formData.accountType === 'profesional_general') {
        payload.nombre = formData.nombre;
        payload.sub_area = formData.sub_area; // nombre de la sub-área general elegida
        payload.institutionName = '';
      } else {
        payload.nombre = formData.nombre;
        payload.sub_area = formData.sub_area;
        payload.institutionName = '';
      }

      const response = await fetch('/api/auth/register-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear cuenta');
      }

      alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
      
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-full max-w-2xl align-middle items-center rounded-sm p-6 md:justify-center'>
                      <div className='text-center mt-4 flex flex-col gap-3'>
              <button
                type='button'
                onClick={() => router.push('/auth/login')}
                className='text-xl font-semibold text-(--main-arci) hover:text-(--soft-arci) hover:underline transition-colors'
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
              <button
                type='button'
                onClick={() => router.push('/auth/genInvitation')}
                className='text-xl font-semibold text-(--main-arci) hover:text-(--soft-arci) hover:underline transition-colors'
              >
                ¿Recibiste una invitación? Complétala aquí
              </button>
            </div>
          <h2 className='text-2xl font-bold text-start font-var(--font-oswald) mb-4'>Registrarse en Arcidrade</h2>
          
          <form onSubmit={handleSubmit} className='form justify-center align-middle'>
            {/* Tipo de Cuenta - Mostrar primero */}
            <div className='mb-6'>
              <label htmlFor='accountType' className='block text-sm font-medium mb-2'>
                Tipo de Cuenta *
              </label>
              <select
                name='accountType'
                id='accountType'
                value={formData.accountType}
                onChange={handleChange}
                className='select select-bordered w-full text-lg font-semibold'
                required
              >
                <option value='profesional'>👨‍⚕️ Profesional de la Salud</option>
                <option value='institution'>🏥 Institución de Salud</option>
                <option value='profesional_general'>🧑‍💼 Profesional General</option>
              </select>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              {/* Email */}
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

              {/* Contraseña */}
              <div className='mb-2'>
                <label htmlFor='password' className='block text-sm font-medium mb-2'>
                  Contraseña *
                </label>
                <div className='relative'>
                  <input 
                    type={showPassword ? 'text' : 'password'}
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
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className='mb-2 md:col-span-2'>
                <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                  Confirmar Contraseña *
                </label>
                <div className='relative'>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
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
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Formulario según tipo de cuenta */}
              {formData.accountType === 'institution' ? (
                <>
                  {/* Nombre de Institución */}
                  <div className='mb-2 md:col-span-2'>
                    <label htmlFor='institutionName' className='block text-sm font-medium mb-2'>
                      Nombre de la Institución *
                    </label>
                    <input 
                      type='text' 
                      name='institutionName' 
                      id='institutionName'
                      value={formData.institutionName}
                      onChange={handleChange}
                      className='input input-bordered w-full'
                      required
                      placeholder='Hospital, Clínica, Centro de Salud...'
                    />
                  </div>
                </>
              ) : formData.accountType === 'profesional_general' ? (
                <>
                  {/* Nombre Completo para Profesional General */}
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

                  {/* Sub Área para Profesional General */}
                  <div className='mb-2 md:col-span-2'>
                    <label htmlFor='sub_area' className='block text-sm font-medium mb-2'>
                      Categoría Profesional *
                    </label>
                    {loadingSubAreas ? (
                      <div className='flex items-center gap-2 h-12'>
                        <span className='loading loading-spinner loading-sm' />
                        <span className='text-sm text-gray-500'>Cargando categorías...</span>
                      </div>
                    ) : subAreasUnavailable ? (
                      <div className='flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2'>
                        <span className='text-blue-500 text-lg'>ℹ️</span>
                        <p className='text-sm text-blue-700'>
                          Las categorías estarán disponibles próximamente. Tu perfil se registrará como <strong>Profesional General</strong>.
                        </p>
                      </div>
                    ) : (
                      <select
                        name='sub_area'
                        id='sub_area'
                        value={formData.sub_area}
                        onChange={handleChange}
                        className='select select-bordered w-full'
                        required
                      >
                        <option value=''>Seleccione una categoría</option>
                        {generalSubAreas.map((item) => (
                          <option key={item.id} value={item.sub_area}>
                            {item.sub_area}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Nombre Completo para Profesional de la Salud */}
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

                  {/* Sub Area para Profesional de la Salud */}
                  <div className='mb-2 md:col-span-2'>
                    <label htmlFor='sub_area' className='block text-sm font-medium mb-2'>
                      Categoría Profesional *
                    </label>
                    <select
                      name='sub_area'
                      id='sub_area'
                      value={formData.sub_area}
                      onChange={handleChange}
                      className='select select-bordered w-full'
                      required
                    >
                      <option value=''>Seleccione una categoría</option>
                      {subAreaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className='flex items-start gap-3 mt-6 bg-white rounded-md px-4 py-3 border border-gray-300'>
              <input
                type='checkbox'
                id='acceptedTerms'
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className='checkbox checkbox-sm mt-0.5 shrink-0'
              />
              <label htmlFor='acceptedTerms' className='text-sm text-gray-700 cursor-pointer'>
                He leído y acepto los{' '}
                <a
                  href='/terminos'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-(--main-arci) underline hover:text-(--soft-arci) font-medium'
                >
                  términos y condiciones
                </a>{' '}
                de uso de la plataforma.
              </label>
            </div>

            <div className='grid grid-cols-2 justify-center gap-2 items-center align-middle mt-4'>
              <button 
                className='btn btn-wide bg-(--main-arci) text-white hover:bg-(--soft-arci) font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none' 
                type='submit'
                disabled={loading || !acceptedTerms}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Registrando...</span>
                  </>
                ) : '📝 Registrarse'}
              </button>
              <button 
                type='button'
                className='btn btn-wide bg-(--orange-arci) text-white hover:bg-orange-600'
                onClick={() => router.push('/')}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
