import { Pool } from 'pg';
import 'dotenv/config';

async function testConnection() {
  console.log('Testing PostgreSQL connection...');
  console.log('DATABASE_URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No');
  console.log('DIRECT_DATABASE_URL configured:', process.env.DIRECT_DATABASE_URL ? 'Yes' : 'No');
  
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ Neither DATABASE_URL nor DIRECT_DATABASE_URL found in environment variables');
    return;
  }
  
  console.log('Using connection string from:', process.env.DIRECT_DATABASE_URL ? 'DIRECT_DATABASE_URL' : 'DATABASE_URL');
  
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time from database:', result.rows[0].now);
    
    client.release();
    await pool.end();
    console.log('✅ All tests passed');
  } catch (error) {
    console.error('❌ Connection failed:');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error(error);
    }
  }
}

testConnection();
