# Runbook Corto - EMAIL-DELIVERY-SETUP

Guia extensa: [EMAIL-DELIVERY-SETUP.md](../EMAIL-DELIVERY-SETUP.md)

## Objetivo
Mejorar entregabilidad de correos y reducir rechazos/spam.

## Pasos rapidos
1. Configura SPF con relay de MailChannels.
2. Configura DKIM con selector activo.
3. Configura DMARC iniciando en p=none.
4. Espera propagacion DNS.
5. Ejecuta test de correo desde script.
6. Valida score en Mail-Tester y corrige hallazgos.

## Comando util
```bash
node scripts/test-email-config.js
```

## Escalamiento
Si iCloud/Gmail siguen rechazando, revisar blacklist y politicas DMARC/DKIM en guia extensa.
