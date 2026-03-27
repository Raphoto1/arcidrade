import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

const tablesToBackup = [
  { tableName: 'Auth', outputKey: 'auth' },
  { tableName: 'Profesional_data', outputKey: 'profesional_data' },
  { tableName: 'Institution_Data', outputKey: 'institution_data' },
  { tableName: 'Process', outputKey: 'process' },
  { tableName: 'Campaign_data', outputKey: 'campaign_data' },
  { tableName: 'Goals', outputKey: 'goals' },
  { tableName: 'fail_mail', outputKey: 'fail_mail' },
  { tableName: 'Main_study', outputKey: 'main_study' },
  { tableName: 'Study_specialization', outputKey: 'study_specialization' },
  { tableName: 'Experience', outputKey: 'experience' },
  { tableName: 'Leads_send', outputKey: 'leads_send' },
  { tableName: 'Profesional_certifications', outputKey: 'profesional_certifications' },
  { tableName: 'Institution_Certifications', outputKey: 'institution_certifications' },
  { tableName: 'Institution_specialization', outputKey: 'institution_specialization' },
  { tableName: 'Study_speciality_favorite', outputKey: 'study_speciality_favorite' },
];

const quoteIdentifier = (value) => `"${value.replace(/"/g, '""')}"`;

async function readTable(pool, tableName) {
  try {
    const result = await pool.query(`SELECT * FROM ${quoteIdentifier(tableName)}`);
    return result.rows;
  } catch (error) {
    console.warn(`⚠️ No se pudo extraer ${tableName}: ${error.message}`);
    return [];
  }
}

async function backupDatabase() {
  console.log('🔄 Iniciando backup de la base de datos de DEPLOY...');
  
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL o DIRECT_DATABASE_URL debe estar definida');
  }
  
  const pool = new Pool({ connectionString });
  
  try {
    const backupData = {};

    for (const { tableName, outputKey } of tablesToBackup) {
      console.log(`📦 Extrayendo datos de ${tableName}...`);
      backupData[outputKey] = await readTable(pool, tableName);
    }

    // Crear objeto con todos los datos
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        environment: 'DEPLOY',
        description: 'Backup completo de la base de datos Arcidrade (Deploy)'
      },
      data: backupData,
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
