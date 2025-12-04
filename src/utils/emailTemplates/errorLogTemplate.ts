/**
 * Plantilla HTML para email de log de errores
 * Migrado desde sendMail.ts - sendErrorLogMail()
 */

interface ErrorLogData {
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  userEmail?: string;
  userName?: string;
  endpoint: string;
  requestBody?: any;
  timestamp: string;
  userAgent?: string;
}

export function getErrorLogTemplate(errorData: ErrorLogData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Log - ARCIDRADE</title>
    <style>
        body {
            font-family: 'Courier New', Consolas, monospace;
            background-color: #1a1a1a;
            margin: 0;
            padding: 20px;
            color: #e0e0e0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #2d2d2d;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(255, 0, 0, 0.2);
            overflow: hidden;
            border: 2px solid #e94936;
        }
        .header {
            background-color: #e94936;
            color: #ffffff;
            padding: 32px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header .timestamp {
            margin-top: 8px;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 20px;
        }
        .error-section {
            background-color: #1a1a1a;
            border-left: 4px solid #e94936;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .error-section h3 {
            margin: 0 0 10px 0;
            color: #ff6b6b;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .error-section .label {
            color: #ffa500;
            font-weight: 600;
            display: inline-block;
            min-width: 120px;
        }
        .error-section .value {
            color: #00ff00;
            word-break: break-all;
        }
        .stack-trace {
            background-color: #000000;
            border: 1px solid #444;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
            line-height: 1.6;
        }
        .stack-trace pre {
            margin: 0;
            color: #ff6b6b;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .request-body {
            background-color: #000000;
            border: 1px solid #444;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
            overflow-x: auto;
        }
        .request-body pre {
            margin: 0;
            color: #00bfff;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 13px;
        }
        .user-info {
            background-color: #2d2d2d;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
            border: 1px solid #555;
        }
        .user-info p {
            margin: 8px 0;
            font-size: 14px;
        }
        .footer {
            background-color: #1a1a1a;
            color: #888;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #444;
        }
        .severity-critical {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header severity-critical">
            <h1>🚨 ERROR CRÍTICO DETECTADO</h1>
            <div class="timestamp">📅 ${errorData.timestamp}</div>
        </div>
        <div class="content">
            <div class="error-section">
                <h3>⚠️ Información del Error</h3>
                <p><span class="label">Tipo de Error:</span> <span class="value">${errorData.errorType}</span></p>
                <p><span class="label">Mensaje:</span> <span class="value">${errorData.errorMessage}</span></p>
                <p><span class="label">Endpoint:</span> <span class="value">${errorData.endpoint}</span></p>
            </div>
            
            ${errorData.userName || errorData.userEmail ? `
            <div class="user-info">
                <h3 style="margin: 0 0 10px 0; color: #ffa500;">👤 Información del Usuario</h3>
                ${errorData.userName ? `<p><span class="label">Nombre:</span> <span class="value">${errorData.userName}</span></p>` : ''}
                ${errorData.userEmail ? `<p><span class="label">Email:</span> <span class="value">${errorData.userEmail}</span></p>` : ''}
                ${errorData.userAgent ? `<p><span class="label">User Agent:</span> <span class="value" style="font-size: 11px;">${errorData.userAgent}</span></p>` : ''}
            </div>
            ` : ''}
            
            ${errorData.errorStack ? `
            <div class="error-section">
                <h3>📋 Stack Trace</h3>
                <div class="stack-trace">
                    <pre>${errorData.errorStack}</pre>
                </div>
            </div>
            ` : ''}
            
            ${errorData.requestBody ? `
            <div class="error-section">
                <h3>📦 Request Body</h3>
                <div class="request-body">
                    <pre>${JSON.stringify(errorData.requestBody, null, 2)}</pre>
                </div>
            </div>
            ` : ''}
            
            <div class="error-section">
                <h3>🔧 Acciones Recomendadas</h3>
                <ul style="color: #e0e0e0; line-height: 1.8;">
                    <li>Revisar los logs del servidor en tiempo real</li>
                    <li>Verificar la conexión a la base de datos</li>
                    <li>Comprobar los datos enviados en el request</li>
                    <li>Revisar validaciones en el controlador</li>
                    <li>Contactar al usuario si es necesario: ${errorData.userEmail || 'N/A'}</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p><strong>🔍 Sistema de Monitoreo de Errores ARCIDRADE</strong></p>
            <p>Este es un email automático generado por el sistema de logging.</p>
            <p>Para más información, revisar los logs del servidor o contactar al equipo de desarrollo.</p>
        </div>
    </div>
</body>
</html>`;
}
