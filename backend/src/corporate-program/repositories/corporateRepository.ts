import { sql } from '../../db/client.js';

export interface CorporateApplicationRecord {
  id?: number;
  user_id: string;
  
  // Referrer Details
  full_name?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  relationship?: string;
  connection_reach?: string;
  
  // Company / Organization Details
  company_name?: string;
  company_website?: string;
  company_country?: string;
  company_city?: string;
  company_industry?: string;
  company_size?: string;
  
  // Introduction Details
  decision_maker?: string;
  intro_method?: string;
  direct_contact_person?: string;
  company_needs?: any;
  referral_context?: string;
  
  // Legacy compatibility fields
  city?: string;
  company_connections?: string;
  industries?: string;
  linkedin_url?: string;
  previous_experience?: string;
  motivation?: string;
  availability?: string;
  
  // Meta
  terms_accepted?: boolean;
  application_status?: string;
  review_status?: string;
  version?: number;
  submitted_at?: string;
  updated_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  status_history?: any[];
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

    const companyNeedsJson = Array.isArray(app.company_needs)
      ? JSON.stringify(app.company_needs)
      : (typeof app.company_needs === 'string' ? app.company_needs : '[]');

    const companyNameVal = app.company_name || existing?.company_name || '';
    const companyCountryVal = app.company_country || existing?.company_country || 'India';
    const companyCityVal = app.company_city || existing?.company_city || app.city || existing?.city || '';
    const companyWebsiteVal = app.company_website || existing?.company_website || '';
    const companyIndustryVal = app.company_industry || app.industries || existing?.company_industry || existing?.industries || '';
    const companySizeVal = app.company_size || existing?.company_size || '';

    const relationshipVal = app.relationship || existing?.relationship || '';
    const connectionReachVal = app.connection_reach || existing?.connection_reach || '';
    const decisionMakerVal = app.decision_maker || existing?.decision_maker || app.company_connections || existing?.company_connections || '';
    const introMethodVal = app.intro_method || existing?.intro_method || '';
    const directContactVal = app.direct_contact_person || existing?.direct_contact_person || '';
    const referralContextVal = app.referral_context || app.motivation || existing?.referral_context || existing?.motivation || '';

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
          country_code = ${app.country_code || existing.country_code || '+91'},
          phone = ${app.phone || existing.phone || ''},
          relationship = ${relationshipVal},
          connection_reach = ${connectionReachVal},

          company_name = ${companyNameVal},
          company_website = ${companyWebsiteVal},
          company_country = ${companyCountryVal},
          company_city = ${companyCityVal},
          company_industry = ${companyIndustryVal},
          company_size = ${companySizeVal},

          decision_maker = ${decisionMakerVal},
          intro_method = ${introMethodVal},
          direct_contact_person = ${directContactVal},
          company_needs = ${companyNeedsJson}::jsonb,
          referral_context = ${referralContextVal},

          city = ${companyCityVal || companyCountryVal},
          company_connections = ${decisionMakerVal},
          industries = ${companyIndustryVal},
          motivation = ${referralContextVal || 'Corporate Referral Introduction'},
          availability = ${app.availability || existing.availability || 'Direct introduction'},
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
          user_id, full_name, email, country_code, phone,
          relationship, connection_reach,
          company_name, company_website, company_country, company_city, company_industry, company_size,
          decision_maker, intro_method, direct_contact_person, company_needs, referral_context,
          city, company_connections, industries, motivation, availability,
          terms_accepted, application_status, review_status,
          version, audit_history
        ) VALUES (
          ${app.user_id}, ${app.full_name || ''}, ${app.email || ''}, ${app.country_code || '+91'}, ${app.phone || ''},
          ${relationshipVal}, ${connectionReachVal},
          ${companyNameVal}, ${companyWebsiteVal}, ${companyCountryVal}, ${companyCityVal}, ${companyIndustryVal}, ${companySizeVal},
          ${decisionMakerVal}, ${introMethodVal}, ${directContactVal}, ${companyNeedsJson}::jsonb, ${referralContextVal},
          ${companyCityVal || companyCountryVal}, ${decisionMakerVal}, ${companyIndustryVal}, ${referralContextVal || 'Corporate Referral Introduction'}, ${app.availability || 'Direct introduction'},
          ${app.terms_accepted ?? true}, 'submitted', 'pending',
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
        user_id, city, company_country, motivation, availability, application_status, review_status
      ) VALUES (
        ${userId}, 'Pending', 'India', 'Express Interest', 'Direct introduction', 'interested', 'pending'
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
        if (statusFilter === 'submitted' || statusFilter === 'pending') {
          apps = apps.filter(a => a.application_status === 'submitted' || a.application_status === 'pending' || a.application_status === 'under_review');
        } else {
          apps = apps.filter(a => a.application_status === statusFilter);
        }
      }

      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        apps = apps.filter(a => {
          const name = (a.full_name || '').toLowerCase();
          const email = (a.email || '').toLowerCase();
          const comp = (a.company_name || '').toLowerCase();
          const ind = (a.company_industry || a.industries || '').toLowerCase();
          const country = (a.company_country || '').toLowerCase();
          const city = (a.company_city || a.city || '').toLowerCase();
          const contactRole = (a.decision_maker || a.company_connections || '').toLowerCase();

          return (
            name.includes(query) ||
            email.includes(query) ||
            comp.includes(query) ||
            ind.includes(query) ||
            country.includes(query) ||
            city.includes(query) ||
            contactRole.includes(query)
          );
        });
      }

      return apps;
    } catch (err) {
      console.error('[CorporateRepository] Error getting all applications:', err);
      return [];
    }
  }

  async updateReviewer(id: string, reviewer: string, status?: string): Promise<boolean> {
    try {
      const isUnassigned = !reviewer || reviewer === 'Unassigned' || status === 'pending' || status === 'submitted';
      const targetReviewer = isUnassigned ? 'Unassigned' : reviewer;
      const targetStatus = status || (isUnassigned ? 'submitted' : 'under_review');

      let historyLogs: any[] = [];
      try {
        const existing = await sql`
          SELECT * FROM corporate_partner_applications
          WHERE id::text = ${id} OR user_id = ${id} LIMIT 1;
        `;
        const current = existing && existing[0];
        if (current) {
          const rawHist = current.status_history || current.statusHistory;
          if (Array.isArray(rawHist)) {
            historyLogs = [...rawHist];
          } else if (typeof rawHist === 'string') {
            try { historyLogs = JSON.parse(rawHist); } catch (e) {}
          }
          if (historyLogs.length === 0) {
            historyLogs.push({
              status: 'pending',
              changed_at: current.submitted_at || current.created_at || new Date().toISOString(),
              changed_by: 'System / User'
            });
          }
          const lastSt = historyLogs[historyLogs.length - 1]?.status;
          if (String(lastSt).toLowerCase() !== String(targetStatus).toLowerCase()) {
            historyLogs.push({
              status: targetStatus,
              changed_at: new Date().toISOString(),
              changed_by: targetReviewer || 'Reviewer'
            });
          }
        }
      } catch (e) {}

      await sql`
        UPDATE corporate_partner_applications
        SET reviewed_by = ${targetReviewer},
            application_status = ${targetStatus},
            review_status = ${targetStatus},
            status_history = ${JSON.stringify(historyLogs)}::jsonb,
            updated_at = CURRENT_TIMESTAMP
        WHERE id::text = ${id} OR user_id = ${id};
      `;

      if (!isUnassigned && targetReviewer && targetReviewer !== 'Unassigned') {
        await sql`
          UPDATE users
          SET is_reviewer = TRUE, updated_at = CURRENT_TIMESTAMP
          WHERE LOWER(name) = ${targetReviewer.toLowerCase()} OR LOWER(email) = ${targetReviewer.toLowerCase()};
        `;
      }
      return true;
    } catch (err) {
      console.error('[corporateRepository.updateReviewer] Error:', err);
      return false;
    }
  }

  async getLearningProgress(userId: string) {
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
    timeSpentSeconds: number
  ) {
    try {
      const jsonCompleted = JSON.stringify(completedModuleIds);
      const rows = await sql`
        INSERT INTO corporate_learning_progress (
          user_id, program_id, current_module_id, completed_module_ids,
          progress_percent, time_spent_seconds, last_accessed_at, updated_at
        ) VALUES (
          ${userId}, 'corporate_growth_partner', ${currentModuleId}, ${jsonCompleted}::jsonb, ${progressPercent}, ${timeSpentSeconds}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, program_id)
        DO UPDATE SET
          current_module_id = ${currentModuleId},
          completed_module_ids = ${jsonCompleted}::jsonb,
          progress_percent = ${progressPercent},
          time_spent_seconds = corporate_learning_progress.time_spent_seconds + ${timeSpentSeconds},
          last_accessed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      return rows[0];
    } catch (err) {
      console.error('[CorporateRepository] Error upserting learning progress:', err);
      return null;
    }
  }
}

export const corporateRepository = new CorporateRepository();
