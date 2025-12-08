const { PrismaClient } = require('./src/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');
const fs = require('fs');

async function backupDatabase() {
  console.log('🔄 Iniciando backup de la base de datos...');
  
  const prisma = new PrismaClient().$extends(withAccelerate());
  
  try {
    // Obtener datos de las tablas principales que existen en el esquema
    console.log('📊 Extrayendo datos de Auth...');
    const authData = await prisma.auth.findMany();
    
    console.log('👨‍⚕️ Extrayendo datos de Profesional_data...');
    const profesionalData = await prisma.profesional_data.findMany();
    
    console.log('🏥 Extrayendo datos de Institution_Data...');
    const institutionData = await prisma.institution_Data.findMany();
    
    console.log('📋 Extrayendo datos de Process...');
    const processData = await prisma.process.findMany();
    
    console.log('📧 Extrayendo datos de Campaign_data...');
    const campaignData = await prisma.campaign_data.findMany();
    
    console.log('🎯 Extrayendo datos de Goals...');
    const goalsData = await prisma.goals.findMany();
    
    console.log('📜 Extrayendo datos de fail_mail...');
    const failMailData = await prisma.fail_mail.findMany();
    
    console.log('🎓 Extrayendo datos de Main_study...');
    const mainStudyData = await prisma.main_study.findMany();
    
    console.log('🔬 Extrayendo datos de Study_specialization...');
    const studySpecializationData = await prisma.study_specialization.findMany();
    
    console.log('💼 Extrayendo datos de Experience...');
    const experienceData = await prisma.experience.findMany();
    
    console.log('📝 Extrayendo datos de Leads_send...');
    const leadsSendData = await prisma.leads_send.findMany();

    // Crear objeto con todos los datos
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        description: 'Backup completo de la base de datos Arcidrade'
      },
      data: {
        auth: authData,
        profesional_data: profesionalData,
        institution_data: institutionData,
        process: processData,
        campaign_data: campaignData,
        goals: goalsData,
        fail_mail: failMailData,
        main_study: mainStudyData,
        study_specialization: studySpecializationData,
        experience: experienceData,
        leads_send: leadsSendData
      }
    };

    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `backup-arcidrade-${timestamp}.json`;
    
    // Guardar el backup
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completado exitosamente!');
    console.log(`📁 Archivo creado: ${filename}`);
    console.log(`📊 Registros totales: ${Object.values(backup.data).reduce((sum, table) => sum + table.length, 0)}`);
    
    // Mostrar resumen por tabla
    console.log('\n📈 Resumen de datos extraídos:');
    Object.entries(backup.data).forEach(([table, data]) => {
      console.log(`   - ${table}: ${data.length} registros`);
    });
    
  } catch (error) {
    console.error('❌ Error durante el backup:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el backup
backupDatabase()
  .then(() => {
    console.log('🎉 Proceso de backup finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  });