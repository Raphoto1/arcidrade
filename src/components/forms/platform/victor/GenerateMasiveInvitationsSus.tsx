'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface InvitationData {
  email: string;
  nombre?: string;
  segundoNombre?: string;
  apellido?: string;
  institucion?: string;
}

interface ProcessingStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  errors: string[];
}

export default function GenerateMasiveInvitationsSus() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<InvitationData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  });
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (uploadedFile: File) => {
    if (!uploadedFile) return;

    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
    
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      alert('Por favor, sube un archivo Excel (.xlsx, .xls) o CSV (.csv)');
      return;
    }

    setFile(uploadedFile);
    setShowResults(false);

    if (fileExtension === 'csv') {
      handleCSVFile(uploadedFile);
    } else {
      handleExcelFile(uploadedFile);
    }
  };

  const handleExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      processFileData(jsonData as string[][]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCSVFile = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        processFileData(results.data as string[][]);
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const processFileData = (rawData: string[][]) => {
    if (rawData.length < 2) {
      alert('El archivo debe tener al menos una fila de encabezados y una fila de datos.');
      return;
    }

    const headers = rawData[0].map(h => h?.toLowerCase().trim());
    const rows = rawData.slice(1);

    // Mapeo inteligente de columnas
    const findColumnIndex = (possibleNames: string[]) => {
      return headers.findIndex(header => 
        possibleNames.some(name => header.includes(name))
      );
    };

    const emailIndex = findColumnIndex(['email', 'correo', 'mail', 'e-mail']);
    const nombreIndex = findColumnIndex(['nombre', 'name', 'primer nombre', 'first name']);
    const segundoNombreIndex = findColumnIndex(['segundo nombre', 'middle name', 'segundo', 'middle']);
    const apellidoIndex = findColumnIndex(['apellido', 'last name', 'surname']);
    const institucionIndex = findColumnIndex(['institucion', 'institution', 'empresa', 'company', 'organizacion']);

    if (emailIndex === -1) {
      alert('No se encontró una columna de email. Asegúrate de que tu archivo tenga una columna con "email", "correo" o "mail".');
      return;
    }

    const processedData = rows
      .map((row, index) => {
        const email = row[emailIndex]?.trim();
        if (!email) return null;

        const invitation: InvitationData = { email };
        
        // Solo agregar campos opcionales si tienen valor
        const nombre = nombreIndex !== -1 ? row[nombreIndex]?.trim() : undefined;
        if (nombre) invitation.nombre = nombre;
        
        const segundoNombre = segundoNombreIndex !== -1 ? row[segundoNombreIndex]?.trim() : undefined;
        if (segundoNombre) invitation.segundoNombre = segundoNombre;
        
        const apellido = apellidoIndex !== -1 ? row[apellidoIndex]?.trim() : undefined;
        if (apellido) invitation.apellido = apellido;
        
        const institucion = institucionIndex !== -1 ? row[institucionIndex]?.trim() : undefined;
        if (institucion) invitation.institucion = institucion;

        return invitation;
      })
      .filter((item): item is InvitationData => item !== null)
      .filter((item, index, array) => {
        // Eliminar duplicados por email
        return array.findIndex(other => other.email === item.email) === index;
      });

    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validData = processedData.filter(item => emailRegex.test(item.email));
    const invalidCount = processedData.length - validData.length;

    if (invalidCount > 0) {
      console.warn(`Se encontraron ${invalidCount} emails con formato inválido y fueron excluidos.`);
    }

    setData(validData);
    console.log(`Archivo procesado: ${validData.length} registros válidos cargados.`);
  };

  const sendInvitations = async () => {
    if (data.length === 0) {
      alert('No hay datos para procesar. Por favor, carga un archivo primero.');
      return;
    }

    setIsProcessing(true);
    setShowResults(true);
    
    const newStats: ProcessingStats = {
      total: data.length,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    };

    setStats(newStats);

    // Procesar en lotes pequeños para evitar sobrecargar el servidor
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (invitation) => {
        try {
          const response = await fetch('/api/platform/victor/mass-invitation-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(invitation),
          });

          const result = await response.json();

          if (response.ok) {
            newStats.successful++;
            console.log(`✅ Invitación enviada a: ${invitation.email}`);
          } else {
            newStats.failed++;
            const errorMsg = `${invitation.email}: ${result.message || 'Error desconocido'}`;
            newStats.errors.push(errorMsg);
            console.error(`❌ Error enviando a ${invitation.email}:`, result.message);
          }
        } catch (error) {
          newStats.failed++;
          const errorMsg = `${invitation.email}: Error de conexión`;
          newStats.errors.push(errorMsg);
          console.error(`❌ Error de red para ${invitation.email}:`, error);
        }

        newStats.processed++;
        setStats({ ...newStats });
      });

      await Promise.all(batchPromises);
      
      // Pequeña pausa entre lotes para no sobrecargar el servidor
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsProcessing(false);
    console.log('🎉 Proceso completado:', newStats);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const resetForm = () => {
    setFile(null);
    setData([]);
    setShowResults(false);
    setStats({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          📧 Invitaciones Masivas con Suscripción
        </h2>
        <p className="text-gray-600">
          Sube un archivo Excel o CSV para enviar invitaciones masivas que registrarán a los usuarios en la plataforma.
        </p>
      </div>

      {/* Información del formato de archivo */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Formato de archivo esperado:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Email:</strong> Campo obligatorio (email, correo, mail)</li>
          <li>• <strong>Nombre:</strong> Opcional (nombre, name, primer nombre)</li>
          <li>• <strong>Segundo Nombre:</strong> Opcional (segundo nombre, middle name)</li>
          <li>• <strong>Apellido:</strong> Opcional (apellido, last name, surname)</li>
          <li>• <strong>Institución:</strong> Opcional (institucion, institution, empresa)</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          💡 Solo el email es obligatorio. El sistema es flexible con los nombres de columnas.
        </p>
        
        {/* Enlaces de descarga de archivos de ejemplo */}
        <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📥 Descargar archivos de ejemplo:</h4>
          <div className="flex flex-wrap gap-3">
            <a
              href="/ejemplo-invitaciones.csv"
              download="ejemplo-invitaciones.csv"
              className="inline-flex items-center px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
            >
              📄 ejemplo-invitaciones.csv
            </a>
            <a
              href="/muestra-formato-mail-list.xlsx"
              download="muestra-formato-mail-list.xlsx"
              className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
            >
              📊 muestra-formato-mail-list.xlsx
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 Usa estos archivos como plantilla para crear tu lista de invitaciones con registro
          </p>
        </div>
      </div>

      {/* Área de carga de archivos */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Arrastra tu archivo aquí o{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                selecciona uno
              </button>
            </p>
            <p className="text-sm text-gray-500">Excel (.xlsx, .xls) o CSV (.csv)</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileUpload(selectedFile);
          }}
          className="hidden"
        />
      </div>

      {/* Información del archivo cargado */}
      {file && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">✅ Archivo cargado exitosamente</h3>
              <p className="text-sm text-green-700">
                <strong>{file.name}</strong> - {data.length} registros válidos encontrados
              </p>
            </div>
            <button
              onClick={resetForm}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cambiar archivo
            </button>
          </div>
        </div>
      )}

      {/* Vista previa de datos */}
      {data.length > 0 && !showResults && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">👀 Vista previa (primeros 5 registros):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellido</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Institución</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-900">{item.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {[item.nombre, item.segundoNombre].filter(Boolean).join(' ') || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.apellido || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.institucion || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                ... y {data.length - 5} registros más
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botón de envío */}
      {data.length > 0 && !showResults && (
        <div className="mt-6 text-center">
          <button
            onClick={sendInvitations}
            disabled={isProcessing}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isProcessing ? '📤 Enviando...' : `🚀 Enviar ${data.length} Invitaciones con Registro`}
          </button>
        </div>
      )}

      {/* Resultados del procesamiento */}
      {showResults && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-gray-800 text-lg">📊 Resultados del envío:</h3>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(stats.processed / stats.total) * 100}%` }}
            ></div>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.processed}</div>
              <div className="text-sm text-yellow-700">Procesados</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              <div className="text-sm text-green-700">Exitosos</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-red-700">Fallidos</div>
            </div>
          </div>

          {/* Lista de errores */}
          {stats.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">❌ Errores encontrados:</h4>
              <div className="max-h-40 overflow-y-auto">
                <ul className="text-sm text-red-700 space-y-1">
                  {stats.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Botón para nueva carga */}
          {!isProcessing && (
            <div className="text-center">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
              >
                🔄 Cargar nuevo archivo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
