import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

if (!config.databaseUrl) {
  throw new Error('❌ DATABASE_URL is not configured. Target PostgreSQL connection required.');
}

export const pool = new Pool({
  connectionString: config.databaseUrl,
  options: '-c search_path=provider_pathways,public',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle PostgreSQL client:', err);
});

export const sql: any = async function sql(
  stringsOrQuery: TemplateStringsArray | string,
  ...values: any[]
): Promise<any[]> {
  // 1. Tagged template call: sql`SELECT * FROM users WHERE id = ${id}`
  if (Array.isArray(stringsOrQuery) && 'raw' in stringsOrQuery) {
    const strings = stringsOrQuery as TemplateStringsArray;
    let text = '';
    for (let i = 0; i < strings.length; i++) {
      text += strings[i];
      if (i < values.length) {
        text += `$${i + 1}`;
      }
    }
    const result = await pool.query(text, values);
    return result.rows;
  }

  // 2. Direct string query call: sql.query("SELECT * FROM ...", [params])
  if (typeof stringsOrQuery === 'string') {
    const params = values.length > 0 && Array.isArray(values[0]) ? values[0] : values;
    const result = await pool.query(stringsOrQuery, params);
    return result.rows;
  }

  throw new Error('Invalid query invocation on sql helper');
};

sql.query = async (queryText: string, params: any[] = []) => {
  const result = await pool.query(queryText, params);
  return result.rows;
};

sql.transaction = async <T>(callback: (clientSql: any) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const clientSql: any = async (strings: TemplateStringsArray | string, ...vals: any[]) => {
      if (Array.isArray(strings) && 'raw' in strings) {
        let text = '';
        for (let i = 0; i < strings.length; i++) {
          text += strings[i];
          if (i < vals.length) text += `$${i + 1}`;
        }
        const res = await client.query(text, vals);
        return res.rows;
      }
      const params = vals.length > 0 && Array.isArray(vals[0]) ? vals[0] : vals;
      const res = await client.query(strings as string, params);
      return res.rows;
    };
    clientSql.query = async (q: string, p: any[] = []) => {
      const res = await client.query(q, p);
      return res.rows;
    };

    const outcome = await callback(clientSql);
    await client.query('COMMIT');
    return outcome;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
