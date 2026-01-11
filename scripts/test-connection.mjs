import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

// Cargar variables de entorno
dotenv.config();

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...\n');
  
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL o DIRECT_DATABASE_URL no está definida');
    process.exit(1);
  }
  
  console.log('📍 Connection String Info:');
  const urlInfo = new URL(connectionString.replace('postgres://', 'http://'));
  console.log(`   Host: ${urlInfo.hostname}`);
  console.log(`   Port: ${urlInfo.port || '5432'}`);
  console.log(`   Database: ${urlInfo.pathname}`);
  console.log(`   Params: ${urlInfo.search}\n`);
  
  let pool;
  let prisma;
  
  try {
    // Test 1: Probar conexión directa con pg
    console.log('Test 1: Conexión directa con Pool de PostgreSQL...');
    pool = new Pool({ 
      connectionString,
      connectionTimeoutMillis: 10000,
    });
    
    const startPool = Date.now();
    const resultPool = await pool.query('SELECT 1 as test, NOW() as current_time');
    const timePool = Date.now() - startPool;
    console.log(`✅ Pool conectado exitosamente (${timePool}ms)`);
    console.log(`   Resultado: ${JSON.stringify(resultPool.rows[0])}\n`);
    
    // Test 2: Probar Prisma Client
    console.log('Test 2: Conexión con Prisma Client...');
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ 
      adapter,
      log: ['error', 'warn']
    });
    
    const startPrisma = Date.now();
    const users = await prisma.auth.count();
    const timePrisma = Date.now() - startPrisma;
    console.log(`✅ Prisma conectado exitosamente (${timePrisma}ms)`);
    console.log(`   Total usuarios: ${users}\n`);
    
    // Test 3: Query más compleja
    console.log('Test 3: Query compleja (simular login)...');
    const startComplex = Date.now();
    const testUser = await prisma.auth.findFirst({
      where: {
        status: 'active'
      },
      select: {
        referCode: true,
        email: true,
        status: true,
        area: true
      }
    });
    const timeComplex = Date.now() - startComplex;
    console.log(`✅ Query compleja exitosa (${timeComplex}ms)`);
    if (testUser) {
      console.log(`   Usuario encontrado: ${testUser.email}\n`);
    } else {
      console.log(`   No se encontraron usuarios activos\n`);
    }
    
    // Test 4: Multiple queries en paralelo
    console.log('Test 4: Múltiples queries en paralelo...');
    const startParallel = Date.now();
    const [authCount, processCount, goalsCount] = await Promise.all([
      prisma.auth.count(),
      prisma.process.count(),
      prisma.goals.count()
    ]);
    const timeParallel = Date.now() - startParallel;
    console.log(`✅ Queries paralelas exitosas (${timeParallel}ms)`);
    console.log(`   Auth: ${authCount}, Process: ${processCount}, Goals: ${goalsCount}\n`);
    
    // Resumen
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TODOS LOS TESTS PASARON EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Tiempo total: ${timePool + timePrisma + timeComplex + timeParallel}ms`);
    console.log(`Promedio: ${Math.round((timePool + timePrisma + timeComplex + timeParallel) / 4)}ms por test\n`);
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA CONEXIÓN:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Tipo: ${error.constructor.name}`);
    console.error(`Mensaje: ${error.message}`);
    if (error.code) console.error(`Código: ${error.code}`);
    if (error.meta) console.error(`Meta:`, error.meta);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Diagnóstico
    console.log('🔧 DIAGNÓSTICO:');
    if (error.message.includes('timeout') || error.code === 'ETIMEDOUT') {
      console.log('⚠️  Problema: TIMEOUT de conexión');
      console.log('💡 Solución: Agregar parámetros de timeout a la URL:');
      console.log('   &connect_timeout=30&socket_timeout=30&statement_timeout=30000\n');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('⚠️  Problema: Conexión rechazada');
      console.log('💡 Solución: Verificar que la base de datos esté accesible\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('⚠️  Problema: Autenticación fallida');
      console.log('💡 Solución: Verificar credenciales en la URL de conexión\n');
    } else if (error.code === 'P1001') {
      console.log('⚠️  Problema: Error P1001 - No se puede conectar a la BD');
      console.log('💡 Solución:');
      console.log('   1. Agregar timeouts a la URL de conexión');
      console.log('   2. Verificar que la BD esté en línea');
      console.log('   3. Revisar configuración de pool en src/utils/db.ts\n');
    }
    
    process.exit(1);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('🔌 Prisma desconectado');
    }
    if (pool) {
      await pool.end();
      console.log('🔌 Pool cerrado');
    }
  }
}

// Ejecutar test
testConnection()
  .then(() => {
    console.log('\n🎉 Test de conexión completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error.message);
    process.exit(1);
  });
