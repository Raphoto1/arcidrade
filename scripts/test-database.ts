import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

interface DiagnosticResult {
  test: string
  status: 'passed' | 'failed'
  duration: number
  error?: string
  details?: Record<string, any>
}

const results: DiagnosticResult[] = []

const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL or DIRECT_DATABASE_URL not configured')
  process.exit(1)
}

console.log('🔍 Database Connection Diagnostics')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Using: ${connectionString.includes('accelerate') ? 'Prisma Accelerate' : 'Direct Connection'}`)
console.log(`Environment: ${process.env.NODE_ENV}\n`)

async function runDiagnostics() {
  // Test 1: Pool Connection
  console.log('Test 1: Creating connection pool...')
  const start1 = Date.now()
  try {
    const pool = new Pool({ 
      connectionString,
      connectionTimeoutMillis: 5000,
      statement_timeout: 5000,
    })
    
    const client = await pool.connect()
    const duration1 = Date.now() - start1
    
    results.push({
      test: 'Pool Connection',
      status: 'passed',
      duration: duration1,
    })
    
    client.release()
    await pool.end()
    console.log(`✅ Passed (${duration1}ms)\n`)
  } catch (error) {
    const duration1 = Date.now() - start1
    results.push({
      test: 'Pool Connection',
      status: 'failed',
      duration: duration1,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`❌ Failed (${duration1}ms): ${error instanceof Error ? error.message : String(error)}\n`)
  }

  // Test 2: Prisma Client
  console.log('Test 2: Initializing Prisma Client...')
  const start2 = Date.now()
  let prisma: PrismaClient
  try {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({ adapter })
    
    const duration2 = Date.now() - start2
    results.push({
      test: 'Prisma Client',
      status: 'passed',
      duration: duration2,
    })
    console.log(`✅ Passed (${duration2}ms)\n`)
  } catch (error) {
    const duration2 = Date.now() - start2
    results.push({
      test: 'Prisma Client',
      status: 'failed',
      duration: duration2,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`❌ Failed (${duration2}ms): ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(1)
  }

  // Test 3: Simple Query
  console.log('Test 3: Running simple query (SELECT 1)...')
  const start3 = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    const duration3 = Date.now() - start3
    results.push({
      test: 'Simple Query',
      status: 'passed',
      duration: duration3,
    })
    console.log(`✅ Passed (${duration3}ms)\n`)
  } catch (error) {
    const duration3 = Date.now() - start3
    results.push({
      test: 'Simple Query',
      status: 'failed',
      duration: duration3,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`❌ Failed (${duration3}ms): ${error instanceof Error ? error.message : String(error)}\n`)
  }

  // Test 4: Actual Login Query
  console.log('Test 4: Running login simulation query...')
  const start4 = Date.now()
  try {
    const user = await prisma.auth.findUnique({
      where: { email: 'test@example.invalid' },
      select: { referCode: true, email: true, password: true, area: true, status: true }
    })
    const duration4 = Date.now() - start4
    results.push({
      test: 'Login Query (findUnique)',
      status: 'passed',
      duration: duration4,
      details: { found: user !== null }
    })
    console.log(`✅ Passed (${duration4}ms)\n`)
  } catch (error) {
    const duration4 = Date.now() - start4
    results.push({
      test: 'Login Query (findUnique)',
      status: 'failed',
      duration: duration4,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`❌ Failed (${duration4}ms): ${error instanceof Error ? error.message : String(error)}\n`)
  }

  // Test 5: Count Query
  console.log('Test 5: Running count query...')
  const start5 = Date.now()
  try {
    const count = await prisma.auth.count()
    const duration5 = Date.now() - start5
    results.push({
      test: 'Count Query',
      status: 'passed',
      duration: duration5,
      details: { count }
    })
    console.log(`✅ Passed (${duration5}ms) - ${count} users found\n`)
  } catch (error) {
    const duration5 = Date.now() - start5
    results.push({
      test: 'Count Query',
      status: 'failed',
      duration: duration5,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`❌ Failed (${duration5}ms): ${error instanceof Error ? error.message : String(error)}\n`)
  }

  // Clean up
  await prisma.$disconnect()

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Summary:')
  const passed = results.filter(r => r.status === 'passed').length
  const total = results.length
  console.log(`${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('✅ Database connection is healthy!')
  } else {
    console.log('❌ Some tests failed. Check errors above.')
    process.exit(1)
  }
}

runDiagnostics()
