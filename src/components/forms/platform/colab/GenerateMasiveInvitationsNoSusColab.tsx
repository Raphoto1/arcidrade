'use client';
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function GenerateMasiveInvitationsNoSusColab() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Por favor seleccione un archivo');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/platform/colab/mass-invitation-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(`✅ ${data.message || 'Invitaciones enviadas exitosamente'}`);
      } else {
        setResult(`❌ Error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      setResult('❌ Error de conexión');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">📨 Invitaciones Masivas Sin Suscripción</h1>
        <p className="text-sm text-gray-600 mb-4">Cargue un archivo CSV o Excel con columnas: nombre, email</p>
        
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          
          {file && <p className="text-sm">Archivo seleccionado: {file.name}</p>}
          
          <button
            onClick={handleSubmit}
            disabled={!file || isProcessing}
            className="btn bg-(--soft-arci) text-white w-full"
          >
            {isProcessing ? 'Procesando...' : 'Enviar Invitaciones'}
          </button>
          
          {result && (
            <div className={`alert ${result.includes('✅') ? 'alert-success' : 'alert-error'}`}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
