const { PrismaClient } = require('./src/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');
const fs = require('fs');
const path = require('path');

async function backupDatabase() {
  console.log('🔄 Iniciando backup de la base de datos...');
  
  const prisma = new PrismaClient().$extends(withAccelerate());
  
  try {
    // Obtener todos los datos de cada tabla
    console.log('📊 Extrayendo datos de Auth...');
    const auth = await prisma.auth.findMany();
    
    console.log('👨‍⚕️ Extrayendo datos de Profesional_data...');
    const profesionalData = await prisma.profesional_data.findMany();
    
    console.log('🏥 Extrayendo datos de Institution_Data...');
    const institutionData = await prisma.institution_Data.findMany();
    
    console.log('📋 Extrayendo datos de Process...');
    const processes = await prisma.process.findMany();
    
    console.log('📧 Extrayendo datos de Campaign_data...');
    const campaignData = await prisma.campaign_data.findMany();
    
    console.log('🎯 Extrayendo datos de Goals...');
    const goals = await prisma.goals.findMany();
    
    console.log('📜 Extrayendo datos de Certifications...');
    const certifications = await prisma.certifications.findMany();
    
    console.log('🏆 Extrayendo datos de Awards...');
    const awards = await prisma.awards.findMany();
    
    console.log('💼 Extrayendo datos de Experience...');
    const experience = await prisma.experience.findMany();
    
    console.log('🎓 Extrayendo datos de Education...');
    const education = await prisma.education.findMany();
    
    console.log('📚 Extrayendo datos de Publications...');
    const publications = await prisma.publications.findMany();
    
    console.log('🔗 Extrayendo datos de Professional_links...');
    const professionalLinks = await prisma.professional_links.findMany();
    
    console.log('👥 Extrayendo datos de Collaborators...');
    const collaborators = await prisma.collaborators.findMany();
    
    console.log('👨‍💼 Extrayendo datos de Managers...');
    const managers = await prisma.managers.findMany();
    
    console.log('🔧 Extrayendo datos de Areas...');
    const areas = await prisma.areas.findMany();
    
    // Crear objeto de backup
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'Arcidrade Database',
        totalTables: 15
      },
      data: {
        auth,
        profesionalData,
        institutionData,
        processes,
        campaignData,
        goals,
        certifications,
        awards,
        experience,
        education,
        publications,
        professionalLinks,
        collaborators,
        managers,
        areas
      },
      statistics: {
        auth: auth.length,
        profesionalData: profesionalData.length,
        institutionData: institutionData.length,
        processes: processes.length,
        campaignData: campaignData.length,
        goals: goals.length,
        certifications: certifications.length,
        awards: awards.length,
        experience: experience.length,
        education: education.length,
        publications: publications.length,
        professionalLinks: professionalLinks.length,
        collaborators: collaborators.length,
        managers: managers.length,
        areas: areas.length
      }
    };
    
    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup_arcidrade_${timestamp}.json`;
    const filePath = path.join(process.cwd(), fileName);
    
    // Escribir archivo de backup
    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completado exitosamente!');
    console.log(`📁 Archivo: ${fileName}`);
    console.log(`📍 Ubicación: ${filePath}`);
    console.log('\n📊 Estadísticas del backup:');
    
    Object.entries(backup.statistics).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} registros`);
    });
    
    const fileSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
    console.log(`\n💾 Tamaño del archivo: ${fileSize} MB`);
    
    return filePath;
    
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    
    if (error.code === 'P2021') {
      console.error('💡 La tabla no existe en la base de datos');
    } else if (error.code === 'P1001') {
      console.error('💡 No se puede conectar a la base de datos');
    } else if (error.code === 'P1008') {
      console.error('💡 Timeout de operación');
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el backup
if (require.main === module) {
  backupDatabase()
    .then((filePath) => {
      console.log(`\n🎉 Backup completado: ${path.basename(filePath)}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error.message);
      process.exit(1);
    });
}

module.exports = { backupDatabase };