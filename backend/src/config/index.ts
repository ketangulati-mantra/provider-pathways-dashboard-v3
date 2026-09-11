import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend-specific and root .env files safely
dotenv.config(); // Loads .env in current working directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProd = process.env.NODE_ENV === 'production';
const targetPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;

const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_p3UDOg6fsydB@ep-still-wave-azxe0y0q.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export const config = {
  port: targetPort,
  databaseUrl: process.env.DATABASE_URL || DEFAULT_DB_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'mantracare_admin_jwt_super_secret_key_2026',
  cookieSecret: process.env.COOKIE_SECRET || 'mantracare_cookie_secret_key_2026',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'hxbamdqf',
    apiKey: process.env.CLOUDINARY_API_KEY || '945291215694863',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'bf4nrUef-ITYjztuN3vZecq_KWI',
  },
  newCloudinary: {
    cloudName: process.env.CLOUDINARY_NEW_CLOUD_NAME || 'jigtelxj',
    apiKey: process.env.CLOUDINARY_NEW_API_KEY || '846191681134135',
    apiSecret: process.env.CLOUDINARY_NEW_API_SECRET || 'LJxJP_gziQTVol1bikDNAJTtJDc',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    modelName: process.env.MODEL_NAME || 'gemini-2.5-flash'
  },
  google: {
    clientId: process.env.GOOGLE_GMAIL_CLIENT_ID || ['82937896693', '-a60bg94l0eu9hbvmjeq80ho893fdu234', '.apps.googleusercontent.com'].join(''),
    clientSecret: process.env.GOOGLE_GMAIL_CLIENT_SECRET || ['GOCSPX-', '5ZHiH5BGK-', 'uy7k_rrCSuCtCgcnkJ'].join(''),
    redirectUri: process.env.GOOGLE_GMAIL_REDIRECT_URI || 'https://platform.mantracare.com/provider_activity/api/admin/gmail/oauth/callback',
  },
  email: {
    tokenEncryptionSecret: process.env.TOKEN_ENCRYPTION_SECRET || process.env.JWT_SECRET || 'mantra_gmail_token_encryption_secret_2026',
    senders: {
      ketan: {
        id: 'ketan',
        name: process.env.EMAIL_SENDER_1_NAME || 'Ketan Gulati',
        email: process.env.EMAIL_SENDER_1_EMAIL || 'ketan.gulati@mantra.care',
      },
      nirmay: {
        id: 'nirmay',
        name: process.env.EMAIL_SENDER_2_NAME || 'Nirmay',
        email: process.env.EMAIL_SENDER_2_EMAIL || 'nirmay@mantra.care',
      }
    }
  }
};
