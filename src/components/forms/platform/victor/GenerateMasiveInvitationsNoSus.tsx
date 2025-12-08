'use client';
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { trackInvitationSent } from '@/utils/analytics';

interface ContactData {
  nombre?: string;
  segundoNombre?: string;
  apellido?: string;
  institucion?: string;
  email: string;
  // Campos normalizados para display
  fullName?: string;
  displayInstitucion?: string;
}

interface ProcessedData {
  valid: ContactData[];
  invalid: { row: number; data: any; errors: string[] }[];
  duplicates: { email: string; count: number }[];
}

export default function GenerateMasiveInvitationsNoSus() {
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailsProgress, setEmailsProgress] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para normalizar nombres de columnas
  const normalizeColumnName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n');
  };

  // Función para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para procesar el archivo
  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let jsonData: any[] = [];

        if (file.name.endsWith('.csv')) {
          // Procesar CSV
          Papa.parse(data as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              jsonData = results.data as any[];
              processData(jsonData);
            },
            error: (error: any) => {
              console.error('Error parsing CSV:', error);
              alert('Error al procesar el archivo CSV');
              setIsProcessing(false);
            }
          });
        } else {
          // Procesar Excel
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
          processData(jsonData);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error al procesar el archivo');
        setIsProcessing(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Función para procesar los datos
  const processData = (rawData: any[]) => {
    const valid: ContactData[] = [];
    const invalid: { row: number; data: any; errors: string[] }[] = [];
    const emailCounts: { [key: string]: number } = {};

    rawData.forEach((row, index) => {
      const errors: string[] = [];
      const contact: ContactData = { email: '' };

      // Normalizar los nombres de las columnas y mapear los datos
      const normalizedRow: { [key: string]: any } = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = normalizeColumnName(key);
        normalizedRow[normalizedKey] = row[key];
      });

      // Mapear campos conocidos
      const fieldMappings = {
        email: ['email', 'correo', 'mail', 'e-mail'],
        nombre: ['nombre', 'name', 'firstname', 'primernombre'],
        segundoNombre: ['segundonombre', 'middlename', 'segundo', 'nombredelmedio'],
        apellido: ['apellido', 'lastname', 'surname', 'apellidos'],
        institucion: ['institucion', 'institution', 'empresa', 'company', 'organizacion']
      };

      // Buscar email (requerido)
      for (const emailField of fieldMappings.email) {
        if (normalizedRow[emailField]) {
          contact.email = String(normalizedRow[emailField]).trim();
          break;
        }
      }

      // Buscar otros campos (opcionales)
      for (const nombreField of fieldMappings.nombre) {
        if (normalizedRow[nombreField]) {
          contact.nombre = String(normalizedRow[nombreField]).trim();
          break;
        }
      }

      for (const segundoField of fieldMappings.segundoNombre) {
        if (normalizedRow[segundoField]) {
          contact.segundoNombre = String(normalizedRow[segundoField]).trim();
          break;
        }
      }

      for (const apellidoField of fieldMappings.apellido) {
        if (normalizedRow[apellidoField]) {
          contact.apellido = String(normalizedRow[apellidoField]).trim();
          break;
        }
      }

      for (const institucionField of fieldMappings.institucion) {
        if (normalizedRow[institucionField]) {
          contact.institucion = String(normalizedRow[institucionField]).trim();
          break;
        }
      }

      // Validaciones
      if (!contact.email) {
        errors.push('Email es requerido');
      } else if (!isValidEmail(contact.email)) {
        errors.push('Email inválido');
      }

      // Generar nombre completo para display
      const nameParts = [contact.nombre, contact.segundoNombre, contact.apellido].filter(Boolean);
      contact.fullName = nameParts.length > 0 ? nameParts.join(' ') : 'Sin nombre';
      contact.displayInstitucion = contact.institucion || 'Sin institución';

      if (errors.length === 0) {
        // Contar duplicados
        const emailKey = contact.email.toLowerCase();
        emailCounts[emailKey] = (emailCounts[emailKey] || 0) + 1;
        valid.push(contact);
      } else {
        invalid.push({ row: index + 1, data: row, errors });
      }
    });

    // Identificar duplicados
    const duplicates = Object.entries(emailCounts)
      .filter(([email, count]) => count > 1)
      .map(([email, count]) => ({ email, count }));

    setProcessedData({ valid, invalid, duplicates });
    setContacts(valid);
    setIsProcessing(false);
  };

  // Función para enviar invitaciones
  const sendInvitations = async () => {
    if (contacts.length === 0) return;

    setIsSending(true);
    setEmailsSent(0);
    setEmailsProgress([]);

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      try {
        const response = await fetch('/api/platform/victor/mass-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: contact.email,
            nombre: contact.nombre,
            segundoNombre: contact.segundoNombre,
            apellido: contact.apellido,
            institucion: contact.institucion,
          }),
        });

        if (response.ok) {
          setEmailsSent(prev => prev + 1);
          setEmailsProgress(prev => [...prev, `✅ ${contact.email} - Enviado exitosamente`]);
          
          // Track analytics
          trackInvitationSent('mass_invitation');
        } else {
          const errorData = await response.json();
          setEmailsProgress(prev => [...prev, `❌ ${contact.email} - Error: ${errorData.message || 'Error desconocido'}`]);
        }
      } catch (error) {
        console.error('Error sending invitation:', error);
        setEmailsProgress(prev => [...prev, `❌ ${contact.email} - Error de conexión`]);
      }

      // Pequeña pausa entre envíos para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSending(false);
  };

  // Función para manejar la carga del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
        setFile(selectedFile);
        setProcessedData(null);
        setContacts([]);
        setEmailsProgress([]);
        setEmailsSent(0);
        processFile(selectedFile);
      } else {
        alert('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)');
        e.target.value = '';
      }
    }
  };

  // Función para limpiar y empezar de nuevo
  const resetForm = () => {
    setFile(null);
    setContacts([]);
    setProcessedData(null);
    setEmailsProgress([]);
    setEmailsSent(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Invitaciones Masivas
          </h1>
          <p className="text-gray-600">
            Sube un archivo Excel o CSV con los contactos para enviar invitaciones a la plataforma ARCIDRADE.
          </p>
          
          {/* Información de formato */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Formato requerido:</h3>
            <div className="text-sm text-blue-800">
              <p><strong>Columnas esperadas:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><span className="font-medium">Email*</span> - Campo obligatorio</li>
                <li><span className="font-medium">Nombre</span> - Opcional</li>
                <li><span className="font-medium">Segundo Nombre</span> - Opcional</li>
                <li><span className="font-medium">Apellido</span> - Opcional</li>
                <li><span className="font-medium">Institución</span> - Opcional</li>
              </ul>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs">
                  <strong>Nota:</strong> Los nombres de columna pueden variar (ej: "correo", "mail", "e-mail" para email)
                </p>
                <div className="flex gap-2">
                  <a
                    href="/ejemplo-invitaciones.csv"
                    download="ejemplo-invitaciones.csv"
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    � Ejemplo CSV
                  </a>
                  <a
                    href="/muestra-formato-mail-list.xlsx"
                    download="muestra-formato-mail-list.xlsx"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    📊 Ejemplo Excel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <div className="space-y-4">
              <div className="text-6xl">📁</div>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-xl font-medium text-gray-900">
                    Selecciona tu archivo
                  </span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="text-gray-500 mt-2">
                  Excel (.xlsx, .xls) o CSV (.csv)
                </p>
              </div>
              
              {file && (
                <div className="text-sm text-green-600 font-medium">
                  ✅ {file.name} seleccionado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg font-medium text-gray-900">
                Procesando archivo...
              </span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {processedData && !isProcessing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Resumen del Archivo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {processedData.valid.length}
                </div>
                <div className="text-green-800 font-medium">Registros válidos</div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {processedData.invalid.length}
                </div>
                <div className="text-red-800 font-medium">Registros inválidos</div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {processedData.duplicates.length}
                </div>
                <div className="text-yellow-800 font-medium">Emails duplicados</div>
              </div>
            </div>

            {/* Invalid Records */}
            {processedData.invalid.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  ❌ Registros con errores:
                </h3>
                <div className="max-h-40 overflow-y-auto bg-red-50 border border-red-200 rounded-lg p-3">
                  {processedData.invalid.map((item, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      <strong>Fila {item.row}:</strong> {item.errors.join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate Emails */}
            {processedData.duplicates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-700 mb-3">
                  ⚠️ Emails duplicados:
                </h3>
                <div className="max-h-32 overflow-y-auto bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  {processedData.duplicates.map((item, index) => (
                    <div key={index} className="text-sm text-yellow-700 mb-1">
                      <strong>{item.email}</strong> aparece {item.count} veces
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {processedData.valid.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={sendInvitations}
                  disabled={isSending}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando... ({emailsSent}/{processedData.valid.length})</span>
                    </span>
                  ) : (
                    `🚀 Enviar ${processedData.valid.length} Invitaciones`
                  )}
                </button>
                
                <button
                  onClick={resetForm}
                  disabled={isSending}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  🔄 Nuevo Archivo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contacts Preview */}
        {contacts.length > 0 && !isSending && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Vista Previa de Contactos</h2>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid gap-3">
                {contacts.slice(0, 10).map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {contact.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {contact.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contact.displayInstitucion}
                      </div>
                    </div>
                    <div className="text-green-600">
                      ✅
                    </div>
                  </div>
                ))}
                {contacts.length > 10 && (
                  <div className="text-center text-gray-500 text-sm p-3">
                    ... y {contacts.length - 10} contactos más
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Log */}
        {emailsProgress.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📋 Progreso del Envío ({emailsSent}/{contacts.length})
            </h2>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {emailsProgress.map((progress, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    progress.includes('✅')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {progress}
                </div>
              ))}
            </div>
            
            {!isSending && emailsSent > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  🎉 Proceso completado: {emailsSent} de {contacts.length} invitaciones enviadas
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
