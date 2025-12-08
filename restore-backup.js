const { PrismaClient } = require('./src/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');
const fs = require('fs');

async function restoreDatabase() {
  console.log('🔄 Iniciando restauración de la base de datos...');
  
  const prisma = new PrismaClient().$extends(withAccelerate());
  
  try {
    // Leer el archivo de backup
    const backupFile = 'backup-arcidrade-2025-10-28T23-13-12.json';
    
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Archivo de backup no encontrado: ${backupFile}`);
    }
    
    console.log(`📂 Leyendo backup desde: ${backupFile}`);
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log(`🕐 Backup creado el: ${backup.metadata.timestamp}`);
    console.log(`📊 Total de registros a restaurar: ${Object.values(backup.data).reduce((sum, table) => sum + table.length, 0)}`);
    
    let restoredCount = 0;
    
    // Restaurar datos en orden (considerando dependencias)
    
    // 1. Auth (tabla principal)
    if (backup.data.auth && backup.data.auth.length > 0) {
      console.log('👤 Restaurando Auth...');
      for (const record of backup.data.auth) {
        try {
          await prisma.auth.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar auth ${record.referCode}: ${error.message}`);
        }
      }
    }
    
    // 2. Main_study
    if (backup.data.main_study && backup.data.main_study.length > 0) {
      console.log('🎓 Restaurando Main_study...');
      for (const record of backup.data.main_study) {
        try {
          await prisma.main_study.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar main_study ${record.id}: ${error.message}`);
        }
      }
    }
    
    // 3. Study_specialization
    if (backup.data.study_specialization && backup.data.study_specialization.length > 0) {
      console.log('🔬 Restaurando Study_specialization...');
      for (const record of backup.data.study_specialization) {
        try {
          await prisma.study_specialization.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar study_specialization ${record.id}: ${error.message}`);
        }
      }
    }
    
    // 4. Profesional_data
    if (backup.data.profesional_data && backup.data.profesional_data.length > 0) {
      console.log('👨‍⚕️ Restaurando Profesional_data...');
      for (const record of backup.data.profesional_data) {
        try {
          await prisma.profesional_data.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar profesional_data ${record.userCode}: ${error.message}`);
        }
      }
    }
    
    // 5. Institution_data
    if (backup.data.institution_data && backup.data.institution_data.length > 0) {
      console.log('🏥 Restaurando Institution_data...');
      for (const record of backup.data.institution_data) {
        try {
          await prisma.institution_Data.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar institution_data ${record.institutionCode}: ${error.message}`);
        }
      }
    }
    
    // 6. Goals
    if (backup.data.goals && backup.data.goals.length > 0) {
      console.log('🎯 Restaurando Goals...');
      for (const record of backup.data.goals) {
        try {
          await prisma.goals.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar goals ${record.id}: ${error.message}`);
        }
      }
    }
    
    // 7. Process
    if (backup.data.process && backup.data.process.length > 0) {
      console.log('📋 Restaurando Process...');
      for (const record of backup.data.process) {
        try {
          await prisma.process.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar process ${record.processCode}: ${error.message}`);
        }
      }
    }
    
    // 8. Campaign_data
    if (backup.data.campaign_data && backup.data.campaign_data.length > 0) {
      console.log('📧 Restaurando Campaign_data...');
      for (const record of backup.data.campaign_data) {
        try {
          await prisma.campaign_data.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar campaign_data ${record.campaignCode}: ${error.message}`);
        }
      }
    }
    
    // 9. Experience
    if (backup.data.experience && backup.data.experience.length > 0) {
      console.log('💼 Restaurando Experience...');
      for (const record of backup.data.experience) {
        try {
          await prisma.experience.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar experience ${record.id}: ${error.message}`);
        }
      }
    }
    
    // 10. Leads_send
    if (backup.data.leads_send && backup.data.leads_send.length > 0) {
      console.log('📝 Restaurando Leads_send...');
      for (const record of backup.data.leads_send) {
        try {
          await prisma.leads_send.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar leads_send ${record.id}: ${error.message}`);
        }
      }
    }
    
    // 11. Fail_mail
    if (backup.data.fail_mail && backup.data.fail_mail.length > 0) {
      console.log('📜 Restaurando Fail_mail...');
      for (const record of backup.data.fail_mail) {
        try {
          await prisma.fail_mail.create({ data: record });
          restoredCount++;
        } catch (error) {
          console.warn(`⚠️  Error al restaurar fail_mail ${record.id}: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Restauración completada!');
    console.log(`📊 Registros restaurados exitosamente: ${restoredCount}`);
    console.log(`📊 Total de registros en backup: ${Object.values(backup.data).reduce((sum, table) => sum + table.length, 0)}`);
    
  } catch (error) {
    console.error('❌ Error durante la restauración:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar la restauración
restoreDatabase()
  .then(() => {
    console.log('🎉 Proceso de restauración finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  });