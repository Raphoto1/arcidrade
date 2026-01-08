import { PrismaClient } from './src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

async function backupDatabase() {
  console.log('🔄 Iniciando backup de la base de datos de DEPLOY...');
  
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL o DIRECT_DATABASE_URL debe estar definida');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    // Obtener datos de las tablas principales
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
    
    console.log('🏆 Extrayendo datos de Profesional_certifications...');
    const profesionalCertificationsData = await prisma.profesional_certifications.findMany();
    
    console.log('🏅 Extrayendo datos de Institution_Certifications...');
    const institutionCertificationsData = await prisma.institution_Certifications.findMany();
    
    console.log('🔖 Extrayendo datos de Institution_specialization...');
    const institutionSpecializationData = await prisma.institution_specialization.findMany();
    
    console.log('⭐ Extrayendo datos de Study_speciality_favorite...');
    const studySpecialityFavoriteData = await prisma.study_speciality_favorite.findMany();

    // Crear objeto con todos los datos
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        environment: 'DEPLOY',
        description: 'Backup completo de la base de datos Arcidrade (Deploy)'
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
        leads_send: leadsSendData,
        profesional_certifications: profesionalCertificationsData,
        institution_certifications: institutionCertificationsData,
        institution_specialization: institutionSpecializationData,
        study_speciality_favorite: studySpecialityFavoriteData
      }
    };

    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `backup-deploy-${timestamp}.json`;
    
    // Guardar el backup
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completado exitosamente!');
    console.log(`📁 Archivo creado: ${filename}`);
    
    const totalRecords = Object.values(backup.data).reduce((sum, table) => sum + table.length, 0);
    console.log(`📊 Registros totales: ${totalRecords}`);
    
    // Mostrar resumen por tabla
    console.log('\n📈 Resumen de datos extraídos:');
    Object.entries(backup.data).forEach(([table, data]) => {
      console.log(`   - ${table}: ${data.length} registros`);
    });
    
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
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
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
