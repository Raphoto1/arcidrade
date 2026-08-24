import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

const quoteIdentifier = (value) => `"${value.replace(/"/g, '""')}"`;

async function readTable(pool, tableName) {
  const result = await pool.query(`SELECT * FROM ${quoteIdentifier(tableName)}`);
  return result.rows;
}

async function listTables(pool) {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  return result.rows.map(({ table_name }) => table_name);
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
    const tablesToBackup = await listTables(pool);

    for (const tableName of tablesToBackup) {
      console.log(`📦 Extrayendo datos de ${tableName}...`);
      backupData[tableName] = await readTable(pool, tableName);
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
