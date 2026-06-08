# 🔧 Configuración Específica para MailChannels

## 📋 Información General

MailChannels es un servicio de relay SMTP utilizado principalmente con:
- Cloudflare Workers/Pages
- Vercel Edge Functions
- Otros servicios serverless

## 🎯 Configuración Paso a Paso

### 1. Verificación de Dominio

MailChannels requiere que verifiques tu dominio para prevenir spam.

#### Opción A: Domain Lockdown (Recomendado)

Agrega este registro TXT en tu DNS:

```
Tipo: TXT
Nombre: _mailchannels
Valor: v=mc1 cfid=tu-cloudflare-account-id
TTL: 3600
```

**¿Cómo obtener tu Cloudflare Account ID?**
1. Inicia sesión en Cloudflare Dashboard
2. Ve a cualquier sitio
3. En la barra lateral derecha, busca "Account ID"
4. Copia el ID

#### Opción B: Verificación por Email (Alternativa)

Si no usas Cloudflare o prefieres otro método:
1. Contacta a support@mailchannels.com
2. Solicita verificación de dominio
3. Sigue las instrucciones que te envíen

---

### 2. Configuración SPF

SPF autoriza a MailChannels a enviar emails en nombre de tu dominio.

```
Tipo: TXT
Nombre: @ (o tu dominio raíz)
Valor: v=spf1 include:relay.mailchannels.net ~all
TTL: 3600
```

**Si ya tienes un registro SPF:**
```
Antes: v=spf1 include:_spf.google.com ~all
Después: v=spf1 include:relay.mailchannels.net include:_spf.google.com ~all
```

⚠️ **IMPORTANTE:** Solo puede haber UN registro SPF por dominio.

---

### 3. Configuración DKIM

DKIM firma digitalmente tus emails para verificar autenticidad.

#### Generar Claves DKIM

**Opción 1: Cloudflare Email Routing**

Si usas Cloudflare Email Routing:
1. Ve a Cloudflare Dashboard → Email Routing
2. Sección "Email DNS records"
3. Busca el registro DKIM (algo como `*._domainkey.arcidrade.com`)
4. Copia el valor

**Opción 2: Generar manualmente**

```bash
# Instalar OpenSSL (si no lo tienes)
# Windows: https://slproweb.com/products/Win32OpenSSL.html
# Mac: brew install openssl
# Linux: sudo apt-get install openssl

# Generar par de llaves
openssl genrsa -out dkim_private.pem 2048
openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem

# Ver clave pública (para DNS)
cat dkim_public.pem
```

**Agregar registro DKIM:**

```
Tipo: TXT
Nombre: mailchannels._domainkey
Valor: v=DKIM1; k=rsa; p=TU_CLAVE_PUBLICA_AQUI
TTL: 3600
```

**Formato de clave pública:**
- Remover `-----BEGIN PUBLIC KEY-----` y `-----END PUBLIC KEY-----`
- Remover saltos de línea
- Dejar solo la cadena base64

Ejemplo:
```
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxyz...
```

---

### 4. Configuración DMARC

DMARC define políticas de autenticación.

```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:dmarc-reports@arcidrade.com; pct=100
TTL: 3600
```

**Evolución de políticas:**

1. **Fase de Monitoreo (Primera semana):**
```
v=DMARC1; p=none; rua=mailto:dmarc-reports@arcidrade.com; pct=100
```

2. **Fase de Cuarentena (Después de verificar reportes):**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@arcidrade.com; pct=100; adkim=s; aspf=s
```

3. **Fase de Rechazo (Producción estable):**
```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@arcidrade.com; pct=100; adkim=s; aspf=s
```

---

### 5. Headers Personalizados en MailChannels

MailChannels soporta headers personalizados para mejorar entregabilidad.

#### Configuración en el Código

Ya implementado en `sendMail.ts`:

```typescript
const mailOptions = {
  from: '"ARCIDRADE Platform" <noreply@arcidrade.com>',
  replyTo: 'contacto@arcidrade.com',
  to: recipient,
  subject: 'Subject',
  text: 'Plain text version',
  html: '<html>...</html>',
  headers: {
    'X-Priority': '3',
    'X-Mailer': 'ARCIDRADE Platform v1.0',
    'Importance': 'Normal',
    'Precedence': 'bulk',
    'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'Message-ID': `<unique-id-${Date.now()}@arcidrade.com>`,
    'X-Entity-Ref-ID': 'your-tracking-id',
  }
};
```

---

### 6. Rate Limiting

MailChannels tiene límites de envío:

**Límites Estándar:**
- **Sin verificación:** ~100 emails/día
- **Con verificación:** Sin límite oficial, pero recomiendan:
  - Nuevos dominios: Comenzar con 100/día
  - Incrementar 50% cada día si no hay issues
  - Objetivo: No más de 10,000/hora

**Implementado en código:**

```typescript
const transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 5,      // Máximo 5 conexiones simultáneas
  maxMessages: 100,       // 100 mensajes por conexión
  rateDelta: 1000,        // 1 segundo
  rateLimit: 5,           // 5 mensajes por segundo
});
```

---

## 🧪 Verificación de Configuración

### 1. Verificar DNS con dig (PowerShell)

```powershell
# SPF
nslookup -type=txt arcidrade.com

# DKIM
nslookup -type=txt mailchannels._domainkey.arcidrade.com

# DMARC
nslookup -type=txt _dmarc.arcidrade.com

# Domain Lockdown
nslookup -type=txt _mailchannels.arcidrade.com
```

### 2. Verificar con MXToolbox

```
SPF: https://mxtoolbox.com/spf.aspx?domain=arcidrade.com
DKIM: https://mxtoolbox.com/dkim.aspx?domain=arcidrade.com&selector=mailchannels
DMARC: https://mxtoolbox.com/dmarc.aspx?domain=arcidrade.com
```

### 3. Test de Envío

```powershell
node scripts/test-email-config.js
```

---

## 🚨 Solución de Problemas Comunes

### Error: "Domain not verified"

**Causa:** MailChannels no reconoce tu dominio.

**Solución:**
1. Verifica que agregaste el registro `_mailchannels`
2. Espera 1-24 horas para propagación DNS
3. Contacta a support@mailchannels.com con tu dominio

### Error: "SPF validation failed"

**Causa:** Registro SPF incorrecto o faltante.

**Solución:**
```bash
# Verificar SPF actual
nslookup -type=txt arcidrade.com

# Debe incluir: include:relay.mailchannels.net
```

### Error: "DKIM signature invalid"

**Causa:** Clave DKIM incorrecta o formato erróneo.

**Solución:**
1. Verifica que removiste headers de la clave pública
2. Verifica que no hay espacios o saltos de línea
3. Usa una herramienta online para validar formato

### Emails llegan a spam

**Verificar:**
- [ ] SPF configurado correctamente
- [ ] DKIM configurado y válido
- [ ] DMARC configurado
- [ ] Domain Lockdown activo
- [ ] Headers anti-spam en código
- [ ] Contenido no tiene palabras spam
- [ ] Ratio texto/imágenes adecuado

**Test:**
```
https://www.mail-tester.com
Objetivo: 8+/10
```

---

## 📊 Monitoreo de Reportes DMARC

### Recibir Reportes

Los reportes DMARC se envían a la dirección en `rua=`:

```
rua=mailto:dmarc-reports@arcidrade.com
```

### Analizadores de Reportes DMARC

**Gratis:**
- https://dmarcian.com (14 días gratis)
- https://dmarc.postmarkapp.com (gratis básico)

**Análisis Manual:**
Los reportes son XML, puedes procesarlos con:
```python
# Script Python simple para analizar
import xml.etree.ElementTree as ET
tree = ET.parse('dmarc_report.xml')
root = tree.getroot()
# ... procesar
```

---

## 📞 Soporte MailChannels

**Email:** support@mailchannels.com
**Documentación:** https://mailchannels.zendesk.com

**Información útil para incluir en tickets:**
- Tu dominio
- Account ID (si usas Cloudflare)
- Error completo
- Hora del error
- Ejemplos de headers de email

---

## ✅ Checklist Final MailChannels

- [ ] Domain Lockdown configurado (`_mailchannels`)
- [ ] SPF incluye `relay.mailchannels.net`
- [ ] DKIM configurado (`mailchannels._domainkey`)
- [ ] DMARC configurado (`_dmarc`)
- [ ] DNS propagado (esperar 24h)
- [ ] Headers anti-spam en código
- [ ] Rate limiting implementado
- [ ] Test con mail-tester.com (8+/10)
- [ ] Test de envío a Gmail exitoso
- [ ] Test de envío a iCloud exitoso
- [ ] Test de envío a Outlook exitoso

---

**Última actualización:** Noviembre 17, 2025
