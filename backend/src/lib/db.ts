import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('connect', () => {
  console.log('Connected to PostgreSQL')
})

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
  process.exit(1)
})


export async function query(text: string, params?: unknown[]) {
  const start = Date.now()

  const result = await pool.query(text, params)

  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - start
    console.log('query', { text, duration, rows: result.rowCount })
  }

  return result
}

export default pool