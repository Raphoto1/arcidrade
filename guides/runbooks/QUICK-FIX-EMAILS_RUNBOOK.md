# Runbook Corto - QUICK-FIX-EMAILS

Guia extensa: [QUICK-FIX-EMAILS.md](../QUICK-FIX-EMAILS.md)

## Objetivo
Recuperar entregabilidad de correos en menos de 1 hora.

## Pasos rapidos
1. Crea/ajusta SPF.
2. Crea/ajusta DKIM.
3. Crea DMARC en p=none.
4. Espera propagacion DNS.
5. Ejecuta test de envio.
6. Verifica score y bandeja de entrada en Gmail/iCloud/Outlook.

## Comando util
```bash
node scripts/test-email-config.js
```

## Escalamiento
Si hay rechazos 5.7.1, validar blacklist y abrir ticket con proveedor SMTP.
