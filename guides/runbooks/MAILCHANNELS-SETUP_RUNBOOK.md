# Runbook Corto - MAILCHANNELS-SETUP

Guia extensa: [MAILCHANNELS-SETUP.md](../MAILCHANNELS-SETUP.md)

## Objetivo
Dejar MailChannels operativo y validado para envio transaccional.

## Pasos rapidos
1. Verifica dominio (_mailchannels o metodo de verificacion).
2. Configura SPF con include de relay.mailchannels.net.
3. Configura DKIM (selector mailchannels._domainkey).
4. Configura DMARC en modo monitoreo.
5. Valida DNS con nslookup/MXToolbox.
6. Ejecuta envio de prueba.

## Comando util
```bash
node scripts/test-email-config.js
```

## Escalamiento
Si hay "Domain not verified" o "SPF failed", revisar propagacion DNS y valor exacto de registros.
