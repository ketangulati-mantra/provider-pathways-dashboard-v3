import postgres from 'postgres';
import { config } from '../config/index.js';

const isProduction = config.nodeEnv === 'production';

// Candidate hosts ordered by likelihood in Docker / EC2 / Local environments
// Explicit configured host and direct AWS host are prioritized over docker internal aliases
const configuredHost = config.pgConfig?.host || process.env.PG_HOST;
const candidateHosts: string[] = Array.from(new Set([
  configuredHost,
  '3.109.26.34',
  'postgres',
  '172.17.0.1',
  'host.docker.internal',
  '127.0.0.1',
  'localhost'
].filter((h): h is string => Boolean(h && h.trim()))));

const dbUser = config.pgConfig?.username || process.env.PG_USER || '';
const dbPassword = config.pgConfig?.password || process.env.PG_PASSWORD || '';
const dbName = config.pgConfig?.database || process.env.PG_DATABASE || '';
const dbPort = config.pgConfig?.port || (process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432);

function createClientForHost(host: string) {
  return postgres({
    host,
    port: dbPort,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    ssl: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 3, // 3s fast timeout to eliminate 30s hangs
    connection: {
      search_path: 'provider_pathways,public',
    },
  });
}

let activeHostIndex = 0;
let activeSql = createClientForHost(candidateHosts[0] || '3.109.26.34');

async function executeWithFailover(templateStrings: any, ...values: any[]) {
  if (!templateStrings) return [];

  for (let attempt = 0; attempt < candidateHosts.length; attempt++) {
    const targetIdx = (activeHostIndex + attempt) % candidateHosts.length;
    const currentHost = candidateHosts[targetIdx];
    try {
      const client = (attempt === 0) ? activeSql : createClientForHost(currentHost);
      const result = await (client as any)(templateStrings, ...values);
      if (attempt > 0) {
        activeHostIndex = targetIdx;
        activeSql = client;
        console.log(`🔌 Connected successfully to database host: ${currentHost}`);
      }
      return result;
    } catch (err: any) {
      const isConnectionError = err?.code === 'CONNECT_TIMEOUT' || 
                               err?.code === 'ECONNREFUSED' || 
                               err?.code === 'ENOTFOUND' || 
                               err?.code === 'ETIMEDOUT' ||
                               err?.message?.includes('CONNECT_TIMEOUT') ||
                               err?.message?.includes('Connection refused');

      if (isConnectionError && attempt < candidateHosts.length - 1) {
        console.warn(`⚠️ Host ${currentHost} unreachable (${err.message || err.code}), failing over to next candidate...`);
        continue;
      }
      throw err;
    }
  }
}

export const sql: any = new Proxy(executeWithFailover, {
  get(target, prop) {
    const val = (activeSql as any)[prop];
    if (typeof val === 'function') {
      return (...args: any[]) => (activeSql as any)[prop](...args);
    }
    return val;
  },
  apply(target, thisArg, args) {
    return executeWithFailover(args[0], ...args.slice(1));
  }
});
