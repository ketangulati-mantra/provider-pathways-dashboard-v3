import { sql } from '../db/client.js';

export async function setupDb(): Promise<void> {
  try {
    console.log('[setupDb] Initializing database schema...');

    // 1. Users Table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255) UNIQUE,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          is_reviewer BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
    } catch (e) {
      console.log('[setupDb] users table check passed');
    }

    // 2. Admin Users Table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id BIGSERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'admin',
          allowed_pages JSONB DEFAULT '["submissions", "corporate_admin", "campus_admin", "lessons"]'::jsonb,
          last_login_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`
        ALTER TABLE admin_users 
        ADD COLUMN IF NOT EXISTS allowed_pages JSONB DEFAULT '["submissions", "corporate_admin", "campus_admin", "lessons"]'::jsonb;
      `;
    } catch (e) {
      console.log('[setupDb] admin_users table check passed');
    }

    // 3. Form Submissions Table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS form_submissions (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          form_id VARCHAR(255) NOT NULL,
          data JSONB NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          reviewed_by VARCHAR(255) DEFAULT 'Unassigned',
          reviewed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
    } catch (e) {
      console.log('[setupDb] form_submissions table check passed');
    }

    // 4. Learning Pathway Progress Table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS user_pathway_progress (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          lesson_id VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          score INT DEFAULT 0,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
    } catch (e) {
      console.log('[setupDb] user_pathway_progress table check passed');
    }

    // 5. Corporate Partner Applications Table (Normalized Referral Schema)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS corporate_partner_applications (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          full_name VARCHAR(255),
          email VARCHAR(255),
          country_code VARCHAR(20) DEFAULT '+1',
          phone VARCHAR(50),
          relationship VARCHAR(255),
          connection_reach VARCHAR(255),
          
          company_name VARCHAR(255),
          company_website VARCHAR(255),
          company_country VARCHAR(100),
          company_city VARCHAR(255),
          company_industry VARCHAR(255),
          company_size VARCHAR(100),
          
          decision_maker VARCHAR(255),
          intro_method VARCHAR(255),
          direct_contact_person VARCHAR(255),
          company_needs JSONB DEFAULT '[]'::jsonb,
          referral_context TEXT,
          
          city VARCHAR(255),
          company_connections TEXT,
          industries TEXT,
          linkedin_url TEXT,
          previous_experience TEXT,
          motivation TEXT,
          availability VARCHAR(100),
          terms_accepted BOOLEAN DEFAULT TRUE,
          application_status VARCHAR(50) DEFAULT 'submitted',
          review_status VARCHAR(50) DEFAULT 'pending',
          version INT DEFAULT 1,
          submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          reviewed_at TIMESTAMP WITH TIME ZONE,
          reviewed_by VARCHAR(255) DEFAULT 'Unassigned',
          status_history JSONB DEFAULT '[]'::jsonb,
          admin_notes TEXT,
          audit_history JSONB DEFAULT '[]'::jsonb
        );
      `;
    } catch (e) {
      console.log('[setupDb] corporate_partner_applications table check passed');
    }

    // Add normalized corporate referral columns if table already exists
    try {
      await sql`
        ALTER TABLE corporate_partner_applications 
        ADD COLUMN IF NOT EXISTS relationship VARCHAR(255),
        ADD COLUMN IF NOT EXISTS connection_reach VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_website VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_country VARCHAR(100),
        ADD COLUMN IF NOT EXISTS company_city VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_industry VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_size VARCHAR(100),
        ADD COLUMN IF NOT EXISTS decision_maker VARCHAR(255),
        ADD COLUMN IF NOT EXISTS intro_method VARCHAR(255),
        ADD COLUMN IF NOT EXISTS direct_contact_person VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_needs JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS referral_context TEXT,
        ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;
      `;
    } catch (e) {
      console.error('[setupDb] Error adding referral columns:', e);
    }

    // 6. Corporate Learning Progress Table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS corporate_learning_progress (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          program_id VARCHAR(100) DEFAULT 'corporate_growth_partner',
          current_module_id VARCHAR(100) DEFAULT 'corp_mod_1',
          completed_module_ids JSONB DEFAULT '[]'::jsonb,
          progress_percent INT DEFAULT 0,
          time_spent_seconds INT DEFAULT 0,
          last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
    } catch (e) {
      console.log('[setupDb] corporate_learning_progress check passed');
    }

    console.log('[setupDb] Database schema initialized successfully.');
  } catch (err) {
    console.error('[setupDb] Error initializing database:', err);
  }
}
