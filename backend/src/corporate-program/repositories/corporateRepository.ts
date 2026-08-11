import { sql } from '../../db/client.js';

export interface CorporateApplicationRecord {
  id?: number;
  user_id: string;
  full_name?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  city: string;
  company_connections?: string;
  industries?: string;
  linkedin_url?: string;
  previous_experience?: string;
  motivation: string;
  availability: string;
  terms_accepted?: boolean;
  application_status?: string;
  review_status?: string;
  version?: number;
  submitted_at?: string;
  updated_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  audit_history?: any[];
}

export class CorporateRepository {
  async getByUserId(userId: string): Promise<CorporateApplicationRecord | null> {
    try {
      const rows = await sql`
        SELECT * FROM corporate_partner_applications
        WHERE user_id = ${userId}
        LIMIT 1;
      `;
      return rows.length > 0 ? (rows[0] as unknown as CorporateApplicationRecord) : null;
    } catch (err) {
      console.error('[CorporateRepository] Error getting by userId:', err);
      return null;
    }
  }

  async saveApplication(app: CorporateApplicationRecord): Promise<CorporateApplicationRecord> {
    const existing = await this.getByUserId(app.user_id);

    if (existing) {
      const newVersion = (existing.version || 1) + 1;
      const currentAudit = Array.isArray(existing.audit_history) ? existing.audit_history : [];
      const newAuditItem = {
        action: 'application_submitted',
        version: newVersion,
        timestamp: new Date().toISOString()
      };
      const updatedAudit = [...currentAudit, newAuditItem];

      const rows = await sql`
        UPDATE corporate_partner_applications
        SET
          full_name = ${app.full_name || existing.full_name || ''},
          email = ${app.email || existing.email || ''},
          country_code = ${app.country_code || existing.country_code || '+1'},
          phone = ${app.phone || existing.phone || ''},
          city = ${app.city || existing.city || ''},
          company_connections = ${app.company_connections || existing.company_connections || ''},
          industries = ${app.industries || existing.industries || ''},
          linkedin_url = ${app.linkedin_url || existing.linkedin_url || ''},
          previous_experience = ${app.previous_experience || existing.previous_experience || ''},
          motivation = ${app.motivation || existing.motivation || ''},
          availability = ${app.availability || existing.availability || ''},
          terms_accepted = ${app.terms_accepted ?? true},
          application_status = 'submitted',
          review_status = 'pending',
          version = ${newVersion},
          submitted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP,
          audit_history = ${JSON.stringify(updatedAudit)}
        WHERE user_id = ${app.user_id}
        RETURNING *;
      `;
      return rows[0] as unknown as CorporateApplicationRecord;
    } else {
      const initialAudit = [{
        action: 'application_submitted',
        version: 1,
        timestamp: new Date().toISOString()
      }];

      const rows = await sql`
        INSERT INTO corporate_partner_applications (
          user_id, full_name, email, country_code, phone, city,
          company_connections, industries, linkedin_url, previous_experience,
          motivation, availability, terms_accepted, application_status, review_status,
          version, audit_history
        ) VALUES (
          ${app.user_id}, ${app.full_name || ''}, ${app.email || ''}, ${app.country_code || '+1'}, ${app.phone || ''}, ${app.city || ''},
          ${app.company_connections || ''}, ${app.industries || ''}, ${app.linkedin_url || ''}, ${app.previous_experience || ''},
          ${app.motivation || ''}, ${app.availability || ''}, ${app.terms_accepted ?? true}, 'submitted', 'pending',
          1, ${JSON.stringify(initialAudit)}
        )
        RETURNING *;
      `;
      return rows[0] as unknown as CorporateApplicationRecord;
    }
  }

  async setInterest(userId: string): Promise<CorporateApplicationRecord> {
    const existing = await this.getByUserId(userId);
    if (existing) {
      return existing;
    }

    const rows = await sql`
      INSERT INTO corporate_partner_applications (
        user_id, city, motivation, availability, application_status, review_status
      ) VALUES (
        ${userId}, 'Pending', 'Express Interest', 'Flexible', 'interested', 'pending'
      )
      RETURNING *;
    `;
    return rows[0] as unknown as CorporateApplicationRecord;
  }

  async getAllApplications(statusFilter?: string, searchQuery?: string): Promise<CorporateApplicationRecord[]> {
    try {
      const rows = await sql`
        SELECT * FROM corporate_partner_applications
        WHERE application_status != 'interested' AND (full_name != '' OR email != '')
        ORDER BY submitted_at DESC;
      `;
      let apps = rows as unknown as CorporateApplicationRecord[];

      if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'submitted') {
          apps = apps.filter(a => a.application_status === 'submitted' || a.application_status === 'under_review');
        } else {
          apps = apps.filter(a => a.application_status === statusFilter);
        }
      }

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        apps = apps.filter(a =>
          (a.full_name && a.full_name.toLowerCase().includes(q)) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          (a.city && a.city.toLowerCase().includes(q))
        );
      }

      return apps;
    } catch (err) {
      console.error('[CorporateRepository] Error getting all applications:', err);
      return [];
    }
  }

  async getLearningProgress(userId: string): Promise<any | null> {
    try {
      const rows = await sql`
        SELECT * FROM corporate_learning_progress
        WHERE user_id = ${userId} AND program_id = 'corporate_growth_partner'
        LIMIT 1;
      `;
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error('[CorporateRepository] Error getting learning progress:', err);
      return null;
    }
  }

  async upsertLearningProgress(
    userId: string,
    currentModuleId: string,
    completedModuleIds: string[],
    progressPercent: number,
    timeSpentSeconds: number = 0
  ): Promise<any> {
    try {
      const jsonCompleted = JSON.stringify(completedModuleIds);
      const rows = await sql`
        INSERT INTO corporate_learning_progress (
          user_id, program_id, current_module_id, completed_module_ids, progress_percent, time_spent_seconds, last_accessed_at, updated_at
        ) VALUES (
          ${userId}, 'corporate_growth_partner', ${currentModuleId}, ${jsonCompleted}::jsonb, ${progressPercent}, ${timeSpentSeconds}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, program_id) DO UPDATE SET
          current_module_id = EXCLUDED.current_module_id,
          completed_module_ids = EXCLUDED.completed_module_ids,
          progress_percent = EXCLUDED.progress_percent,
          time_spent_seconds = corporate_learning_progress.time_spent_seconds + ${timeSpentSeconds},
          last_accessed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      return rows[0];
    } catch (err) {
      console.error('[CorporateRepository] Error upserting learning progress:', err);
      throw err;
    }
  }
}

export const corporateRepository = new CorporateRepository();
