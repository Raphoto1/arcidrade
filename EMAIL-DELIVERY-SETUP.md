# 📧 Guía de Configuración para Mejorar Entregabilidad de Emails

## 🚨 Problema Actual
Error: `5.7.1 - Rejected by smtp.mailchannels.net`

Este error indica que los servidores de destino (como iCloud, Gmail, etc.) están rechazando los emails por:
- Falta de autenticación SPF/DKIM
- Mala reputación del dominio/IP
- Contenido marcado como spam

---

## ✅ Solución: Configuración DNS Crítica

### 1️⃣ SPF (Sender Policy Framework)

**¿Qué hace?** Autoriza qué servidores pueden enviar emails desde tu dominio.

**Agregar este registro TXT en tu DNS:**

```
Tipo: TXT
Nombre: @ (o tu dominio raíz)
Valor: v=spf1 include:relay.mailchannels.net ~all
TTL: 3600
```

**Para MailChannels específicamente:**
```
v=spf1 include:relay.mailchannels.net include:_spf.google.com ~all
```

---

### 2️⃣ DKIM (DomainKeys Identified Mail)

**¿Qué hace?** Firma digitalmente tus emails para verificar que no han sido modificados.

#### Para MailChannels, necesitas:

1. **Generar par de llaves DKIM** (si no las tienes)
2. **Agregar registro DNS:**

```
Tipo: TXT
Nombre: mailchannels._domainkey
Valor: v=DKIM1; k=rsa; p=TU_CLAVE_PUBLICA_AQUI
TTL: 3600
```

**Cómo obtener tu clave DKIM:**
- Contacta a soporte de MailChannels o tu proveedor de hosting
- Si usas Cloudflare Pages/Workers con MailChannels, necesitas configurar DKIM en tu panel

---

### 3️⃣ DMARC (Domain-based Message Authentication)

**¿Qué hace?** Define qué hacer con emails que fallan SPF/DKIM.

**Agregar este registro TXT:**

```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@arcidrade.com; ruf=mailto:dmarc-failures@arcidrade.com; pct=100; adkim=s; aspf=s
TTL: 3600
```

**Opciones de política:**
- `p=none` - Solo monitorear (comenzar aquí)
- `p=quarantine` - Marcar como spam (recomendado después de probar)
- `p=reject` - Rechazar completamente (más estricto)

---

### 4️⃣ Registro PTR/Reverse DNS

**¿Qué hace?** Verifica que tu IP coincida con tu dominio.

**Acción requerida:**
- Contacta a tu proveedor de hosting
- Solicita que configuren el PTR record de tu IP para que apunte a `mail.arcidrade.com`

---

## 🔧 Configuración Específica para MailChannels

### Si usas Cloudflare Workers + MailChannels:

1. **Verificar dominio en MailChannels:**
   - Agregar registro TXT de verificación que MailChannels te proporcione

2. **Configurar Domain Lockdown:**
```
Tipo: TXT
Nombre: _mailchannels
Valor: v=mc1 cfid=tu-cloudflare-account-id
```

3. **Headers personalizados en código:**
Ya implementado en `sendMail.ts` ✅

---

## 📊 Herramientas de Verificación

### 1. Mail-Tester (Más Importante)
🔗 https://www.mail-tester.com

**Cómo usar:**
1. Obtén la dirección temporal del sitio
2. Envía un email de prueba desde tu aplicación
3. Revisa el score (debe ser 8+/10)
4. Implementa las recomendaciones

### 2. MXToolbox
🔗 https://mxtoolbox.com/SuperTool.aspx

**Verificar:**
- SPF Record: `https://mxtoolbox.com/spf.aspx`
- DKIM Record: `https://mxtoolbox.com/dkim.aspx`
- DMARC Record: `https://mxtoolbox.com/dmarc.aspx`
- Blacklist Check: `https://mxtoolbox.com/blacklists.aspx`

### 3. Google Postmaster Tools
🔗 https://postmaster.google.com

**Beneficios:**
- Monitorear reputación del dominio
- Ver tasa de spam complaints
- Verificar autenticación SPF/DKIM

### 4. Microsoft SNDS (para Outlook/Hotmail)
🔗 https://sendersupport.olc.protection.outlook.com/snds/

---

## 🎯 Pasos Inmediatos

### Prioridad ALTA (Hacer HOY):

1. ✅ **Agregar SPF Record**
   ```
   v=spf1 include:relay.mailchannels.net ~all
   ```

2. ✅ **Configurar DKIM con MailChannels**
   - Contactar soporte de MailChannels
   - O revisar panel de Cloudflare si usas Workers

3. ✅ **Agregar DMARC inicial (modo monitor)**
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@arcidrade.com
   ```

4. ✅ **Verificar con Mail-Tester**
   - Enviar email de prueba
   - Objetivo: Score 8+/10

### Prioridad MEDIA (Esta semana):

5. ⚠️ **Calentar el dominio gradualmente**
   - Día 1: 10 emails
   - Día 2: 20 emails
   - Día 3: 50 emails
   - Incrementar 50% diario hasta llegar a volumen normal

6. ⚠️ **Configurar PTR Record**
   - Contactar hosting provider

7. ⚠️ **Registrar dominio en Google Postmaster**

### Prioridad BAJA (Próximas semanas):

8. 📊 **Monitorear métricas**
   - Bounce rate < 5%
   - Complaint rate < 0.1%
   - Open rate monitoring

9. 📊 **Ajustar DMARC a quarantine**
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@arcidrade.com
   ```

---

## 🛡️ Mejores Prácticas Adicionales

### Contenido del Email:

✅ **HACER:**
- Ratio texto/imagen: 60% texto, 40% imágenes
- Siempre incluir versión texto plano completa
- Links con URLs completas y visibles
- Enlace de unsubscribe visible en el footer
- Dirección física de la empresa
- Contenido relevante y personalizado

❌ **EVITAR:**
- Palabras spam: "gratis", "urgente", "gana dinero", "$$$"
- MAYÚSCULAS EXCESIVAS
- Muchos signos de exclamación!!!
- Emojis excesivos en asunto 🎉🎊🎈
- Archivos adjuntos sospechosos (.exe, .zip)
- Acortadores de URL (bit.ly, tinyurl)
- Imágenes sin texto alternativo

### Infraestructura:

✅ **Recomendaciones:**
- Usar dominio dedicado para emails (mail.arcidrade.com)
- IP dedicada si envías >10,000 emails/mes
- Implementar rate limiting (no más de 100 emails/hora al inicio)
- Double opt-in para subscripciones
- Limpiar lista de bounces regularmente

---

## 📈 Monitoreo Continuo

### KPIs Importantes:

```
✅ Bounce Rate: < 5%
✅ Complaint Rate: < 0.1%
✅ Spam Score: < 8/10 en Mail-Tester
✅ SPF/DKIM Pass Rate: > 99%
✅ Inbox Placement: > 80%
```

### Herramientas de Monitoreo:

- **Google Postmaster Tools** - Reputación en Gmail
- **Microsoft SNDS** - Reputación en Outlook
- **Mail-Tester** - Score general
- **MXToolbox Monitoring** - Blacklist monitoring
- **250ok o Litmus** - Inbox placement testing (paid)

---

## 🆘 Troubleshooting

### Si sigues teniendo problemas:

1. **Verifica tu IP en blacklists:**
   ```
   https://mxtoolbox.com/blacklists.aspx
   ```

2. **Revisa logs de MailChannels:**
   - Busca errores específicos
   - Contacta soporte con detalles

3. **Contacta al proveedor de email del destinatario:**
   - iCloud: https://support.apple.com/icloud-email
   - Gmail: https://support.google.com/mail/contact/bulk_send_new
   - Outlook: https://sendersupport.olc.protection.outlook.com/pm/

4. **Considera usar un servicio de email transaccional:**
   - SendGrid (12,000 gratis/mes)
   - Mailgun (5,000 gratis/mes)
   - Amazon SES (muy económico)
   - Postmark (mejor deliverability)

---

## 📞 Contactos de Soporte

- **MailChannels Support:** support@mailchannels.com
- **Cloudflare Support:** Si usas Workers
- **Tu DNS Provider:** Para configurar registros

---

## ✅ Checklist Final

Antes de enviar emails en producción:

- [ ] SPF configurado y verificado
- [ ] DKIM configurado y verificado
- [ ] DMARC configurado (al menos en modo monitor)
- [ ] PTR Record configurado
- [ ] Mail-Tester score > 8/10
- [ ] No estás en ninguna blacklist
- [ ] Código actualizado con headers anti-spam ✅
- [ ] Contenido de emails revisado
- [ ] Enlace de unsubscribe funcional
- [ ] Rate limiting implementado
- [ ] Dominio registrado en Google Postmaster

---

**Última actualización:** Noviembre 17, 2025
**Versión:** 1.0
**Contacto:** Equipo de desarrollo ARCIDRADE
