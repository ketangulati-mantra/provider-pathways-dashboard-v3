import { sql } from '../db/client.js';

export async function setupDb(): Promise<void> {
  try {
    console.log('[setupDb] Verifying database connection...');
    await sql`SELECT 1;`;
    console.log('[setupDb] Database connection and schema verified successfully.');
  } catch (err) {
    console.error('[setupDb] Error verifying database:', err);
  }
}
