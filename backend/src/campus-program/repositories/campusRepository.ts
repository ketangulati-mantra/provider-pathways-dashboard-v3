import { sql } from '../../db/client.js';
import { AmbassadorProfile, CampusApplication, LearningProgress, CreditLedgerEntry, JourneyStage, AuditHistoryEntry, AdminApplicationsQuery, AdminApplicationsResponse } from '../models/types.js';

export class CampusRepository {
  /**
   * Find ambassador profile by userId
   */
  async findProfileByUserId(userId: string): Promise<AmbassadorProfile | null> {
    const rows = await sql`
      SELECT * FROM ambassador_profiles WHERE user_id = ${userId} LIMIT 1;
    `;
    return (rows[0] as AmbassadorProfile) || null;
  }

  /**
   * Get total credit balance for user
   */
  async getCreditBalance(userId: string): Promise<number> {
    const sumResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM credit_ledger WHERE user_id = ${userId};
    `;
    return parseInt(sumResult[0]?.total || '0', 10);
  }

  /**
   * Create a new ambassador profile
   */
  async createProfile(userId: string, stage: JourneyStage = JourneyStage.NOT_JOINED, collegeName?: string): Promise<AmbassadorProfile> {
    const ambId = `AMB_${userId.substring(0, 6).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const refCode = `CAMPUS_${userId.substring(0, 6).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const rows = await sql`
      INSERT INTO ambassador_profiles (
        user_id, ambassador_id, current_stage, current_step, approval_status, credits, level, referral_code, college_name, status
      ) VALUES (
        ${userId}, ${ambId}, ${stage}, 1, 'none', 0, 1, ${refCode}, ${collegeName || null}, 'active'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        current_stage = EXCLUDED.current_stage,
        college_name = COALESCE(EXCLUDED.college_name, ambassador_profiles.college_name),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return rows[0] as AmbassadorProfile;
  }

  /**
   * Insert or update Phase 2.5 application form entries into DB
   */
  async createOrUpdateApplication(appData: Partial<CampusApplication>): Promise<CampusApplication> {
    const programId = appData.program_id || 'campus_awareness';
    const rows = await sql`
      INSERT INTO campus_program_applications (
        user_id, program_id, full_name, email, country_code, phone, college, course, year, city,
        motivation, availability, linkedin_url, instagram_url, previous_experience,
        terms_accepted, community_guidelines_accepted, application_status, version
      ) VALUES (
        ${appData.user_id}, ${programId}, ${appData.full_name || null}, ${appData.email || null}, 
        ${appData.country_code || '+1'}, ${appData.phone || ''}, ${appData.college || ''}, 
        ${appData.course || ''}, ${appData.year || '1st Year'}, ${appData.city || ''},
        ${appData.motivation || ''}, ${appData.availability || '3-5 hours/week'}, 
        ${appData.linkedin_url || null}, ${appData.instagram_url || null}, ${appData.previous_experience || null},
        ${appData.terms_accepted ?? true}, ${appData.community_guidelines_accepted ?? true}, 'submitted', 1
      )
      ON CONFLICT (user_id, program_id, version) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        country_code = EXCLUDED.country_code,
        phone = EXCLUDED.phone,
        college = EXCLUDED.college,
        course = EXCLUDED.course,
        year = EXCLUDED.year,
        city = EXCLUDED.city,
        motivation = EXCLUDED.motivation,
        availability = EXCLUDED.availability,
        linkedin_url = EXCLUDED.linkedin_url,
        instagram_url = EXCLUDED.instagram_url,
        previous_experience = EXCLUDED.previous_experience,
        application_status = 'submitted',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const app = rows[0] as CampusApplication;
    
    // Log initial audit history entry
    await this.createAuditEntry(
      app.id ? String(app.id) : null,
      appData.user_id!,
      programId,
      'draft',
      'submitted',
      appData.user_id!,
      'Initial application submission'
    );

    return app;
  }

  /**
   * Create a brand new versioned application row (Phase 4 Resubmission Versioning)
   */
  async createNewApplicationVersion(userId: string, appData: Partial<CampusApplication>, programId: string = 'campus_awareness'): Promise<CampusApplication> {
    const latest = await this.findApplicationByUserId(userId, programId);
    const newVersion = (latest?.version || 1) + 1;
    const parentId = latest?.id ? parseInt(latest.id, 10) : null;

    const rows = await sql`
      INSERT INTO campus_program_applications (
        user_id, program_id, full_name, email, country_code, phone, college, course, year, city,
        motivation, availability, linkedin_url, instagram_url, previous_experience,
        terms_accepted, community_guidelines_accepted, application_status, version, parent_application_id, resubmission_count
      ) VALUES (
        ${userId}, ${programId}, 
        ${appData.full_name || latest?.full_name || null}, 
        ${appData.email || latest?.email || null}, 
        ${appData.country_code || latest?.country_code || '+1'}, 
        ${appData.phone || latest?.phone || ''}, 
        ${appData.college || latest?.college || ''}, 
        ${appData.course || latest?.course || ''}, 
        ${appData.year || latest?.year || '1st Year'}, 
        ${appData.city || latest?.city || ''},
        ${appData.motivation || latest?.motivation || ''}, 
        ${appData.availability || latest?.availability || '3-5 hours/week'}, 
        ${appData.linkedin_url || latest?.linkedin_url || null}, 
        ${appData.instagram_url || latest?.instagram_url || null}, 
        ${appData.previous_experience || latest?.previous_experience || null},
        true, true, 'submitted', ${newVersion}, ${parentId}, ${(latest?.resubmission_count || 0) + 1}
      )
      RETURNING *;
    `;

    const newApp = rows[0] as CampusApplication;

    await this.createAuditEntry(
      newApp.id ? String(newApp.id) : null,
      userId,
      programId,
      latest?.application_status || 'rejected',
      'submitted',
      userId,
      `Resubmitted new application version v${newVersion}`
    );

    return newApp;
  }

  /**
   * Find latest application entry by userId
   */
  async findApplicationByUserId(userId: string, programId: string = 'campus_awareness'): Promise<CampusApplication | null> {
    const rows = await sql`
      SELECT * FROM campus_program_applications 
      WHERE user_id = ${userId} AND program_id = ${programId} 
      ORDER BY version DESC, id DESC LIMIT 1;
    `;
    return (rows[0] as CampusApplication) || null;
  }

  /**
   * Get all version entries for an applicant
   */
  async getApplicationVersionHistory(userId: string, programId: string = 'campus_awareness'): Promise<CampusApplication[]> {
    const rows = await sql`
      SELECT * FROM campus_program_applications 
      WHERE user_id = ${userId} AND program_id = ${programId}
      ORDER BY version ASC, submitted_at ASC;
    `;
    return rows as CampusApplication[];
  }

  /**
   * Find application by unique ID
   */
  async findApplicationById(applicationId: string): Promise<CampusApplication | null> {
    const rows = await sql`
      SELECT * FROM campus_program_applications WHERE id = ${parseInt(applicationId, 10)} LIMIT 1;
    `;
    return (rows[0] as CampusApplication) || null;
  }

  /**
   * Phase 4 Admin Applications List Query with Status Filter & Search
   */
  async getAdminApplications(queryParams: AdminApplicationsQuery = {}): Promise<AdminApplicationsResponse> {
    const status = queryParams.status || 'all';
    const search = (queryParams.search || '').trim().toLowerCase();
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 20;

    // Fetch all applications with latest email log
    const allRows = await sql`
      WITH latest_emails AS (
        SELECT DISTINCT ON (COALESCE(application_id, recipient_email))
          application_id,
          recipient_email,
          status as latest_email_status,
          template as latest_email_template,
          sent_at as latest_email_sent_at,
          sender_id as latest_email_sender
        FROM email_logs
        ORDER BY COALESCE(application_id, recipient_email), sent_at DESC, id DESC
      )
      SELECT DISTINCT ON (cpa.user_id) 
        cpa.*,
        le.latest_email_status,
        le.latest_email_template,
        le.latest_email_sent_at,
        le.latest_email_sender
      FROM campus_program_applications cpa
      LEFT JOIN latest_emails le 
        ON (le.application_id = CAST(cpa.id AS VARCHAR) OR le.recipient_email = cpa.email)
      ORDER BY cpa.user_id, cpa.version DESC, cpa.id DESC;
    `;

    let filtered = allRows as CampusApplication[];

    // Calculate status counts
    const statusCounts = {
      all: filtered.length,
      submitted: filtered.filter(a => a.application_status === 'submitted').length,
      under_review: filtered.filter(a => a.application_status === 'under_review').length,
      approved: filtered.filter(a => a.application_status === 'approved').length,
      rejected: filtered.filter(a => a.application_status === 'rejected').length,
      more_info_required: filtered.filter(a => a.application_status === 'more_info_required').length
    };

    // Filter by status tab
    if (status !== 'all') {
      filtered = filtered.filter(a => a.application_status === status);
    }

    // Filter by search query
    if (search) {
      filtered = filtered.filter(a => 
        (a.full_name || '').toLowerCase().includes(search) ||
        (a.email || '').toLowerCase().includes(search) ||
        (a.college || '').toLowerCase().includes(search) ||
        (a.user_id || '').toLowerCase().includes(search)
      );
    }

    // Sort by submitted_at DESC
    filtered.sort((a, b) => new Date(b.submitted_at || b.updated_at || 0).getTime() - new Date(a.submitted_at || a.updated_at || 0).getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      applications: paginated,
      total,
      page,
      limit,
      statusCounts
    };
  }

  /**
   * Create immutable audit log entry (Phase 3.5 & 4)
   */
  async createAuditEntry(
    applicationId: string | null,
    userId: string,
    programId: string,
    fromStatus: string | null,
    toStatus: string,
    changedBy: string,
    notes?: string,
    metadata?: Record<string, any>
  ): Promise<AuditHistoryEntry> {
    const rows = await sql`
      INSERT INTO campus_application_audit_history (
        application_id, user_id, program_id, from_status, to_status, changed_by, notes, metadata
      ) VALUES (
        ${applicationId ? parseInt(applicationId, 10) : null}, ${userId}, ${programId}, 
        ${fromStatus}, ${toStatus}, ${changedBy}, ${notes || null}, ${JSON.stringify(metadata || {})}::jsonb
      )
      RETURNING *;
    `;
    return rows[0] as AuditHistoryEntry;
  }

  /**
   * Fetch immutable audit history for user
   */
  async getAuditHistory(userId: string, programId: string = 'campus_awareness'): Promise<AuditHistoryEntry[]> {
    const rows = await sql`
      SELECT * FROM campus_application_audit_history 
      WHERE user_id = ${userId} AND program_id = ${programId}
      ORDER BY created_at ASC;
    `;
    return rows as AuditHistoryEntry[];
  }

  /**
   * Phase 4 Admin Review Action (Approve, Reject with mandatory reason, Request Info)
   */
  async adminReviewApplication(
    applicationId: string,
    userId: string,
    newStatus: string,
    reviewerNotes?: string,
    reviewReason?: string,
    requestedFields?: string[],
    reviewerId: string = 'admin_reviewer',
    programId: string = 'campus_awareness'
  ): Promise<CampusApplication> {
    const current = await this.findApplicationById(applicationId);
    const jsonReqFields = JSON.stringify(requestedFields || []);

    const rows = await sql`
      UPDATE campus_program_applications
      SET 
        application_status = ${newStatus},
        reviewer_notes = ${reviewerNotes || null},
        review_reason = ${reviewReason || null},
        requested_info_fields = ${jsonReqFields}::jsonb,
        reviewed_by = ${reviewerId},
        reviewed_at = CURRENT_TIMESTAMP,
        approval_at = ${newStatus === 'approved' ? sql`CURRENT_TIMESTAMP` : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(applicationId, 10)}
      RETURNING *;
    `;

    const updated = rows[0] as CampusApplication;

    // Record audit entry
    await this.createAuditEntry(
      applicationId,
      userId,
      programId,
      current?.application_status || 'submitted',
      newStatus,
      reviewerId,
      reviewReason || reviewerNotes
    );

    return updated;
  }

  /**
   * Resubmit application after requested info update (Phase 3.5)
   */
  async resubmitApplication(
    userId: string,
    updatedData: Partial<CampusApplication>,
    programId: string = 'campus_awareness'
  ): Promise<CampusApplication> {
    const current = await this.findApplicationByUserId(userId, programId);
    const count = (current?.resubmission_count || 0) + 1;

    const rows = await sql`
      UPDATE campus_program_applications
      SET 
        full_name = COALESCE(${updatedData.full_name || null}, full_name),
        email = COALESCE(${updatedData.email || null}, email),
        country_code = COALESCE(${updatedData.country_code || null}, country_code),
        phone = COALESCE(${updatedData.phone || null}, phone),
        college = COALESCE(${updatedData.college || null}, college),
        course = COALESCE(${updatedData.course || null}, course),
        year = COALESCE(${updatedData.year || null}, year),
        city = COALESCE(${updatedData.city || null}, city),
        motivation = COALESCE(${updatedData.motivation || null}, motivation),
        availability = COALESCE(${updatedData.availability || null}, availability),
        linkedin_url = COALESCE(${updatedData.linkedin_url || null}, linkedin_url),
        instagram_url = COALESCE(${updatedData.instagram_url || null}, instagram_url),
        previous_experience = COALESCE(${updatedData.previous_experience || null}, previous_experience),
        application_status = 'submitted',
        resubmission_count = ${count},
        requested_info_fields = '[]'::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND program_id = ${programId}
      RETURNING *;
    `;

    const resubmitted = rows[0] as CampusApplication;

    await this.createAuditEntry(
      resubmitted.id ? String(resubmitted.id) : null,
      userId,
      programId,
      current?.application_status || 'more_info_required',
      'submitted',
      userId,
      `Resubmission #${count} by applicant`
    );

    return resubmitted;
  }

  /**
   * Activate Ambassador Profile upon approval (Phase 3.5 & 4 Activation)
   */
  async activateAmbassadorProfile(userId: string, collegeName?: string): Promise<AmbassadorProfile> {
    const existing = await this.findProfileByUserId(userId);
    const ambId = existing?.ambassador_id || `AMB_${userId.substring(0, 6).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const refCode = existing?.referral_code || `CAMPUS_${userId.substring(0, 6).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const rows = await sql`
      INSERT INTO ambassador_profiles (
        user_id, ambassador_id, current_stage, current_step, approval_status, credits, level, referral_code, college_name, joined_date, status
      ) VALUES (
        ${userId}, ${ambId}, ${JourneyStage.ACTIVE}, 7, 'approved', 70, 1, ${refCode}, ${collegeName || null}, CURRENT_TIMESTAMP, 'active'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        ambassador_id = COALESCE(ambassador_profiles.ambassador_id, EXCLUDED.ambassador_id),
        current_stage = ${JourneyStage.ACTIVE},
        current_step = 7,
        approval_status = 'approved',
        joined_date = COALESCE(ambassador_profiles.joined_date, CURRENT_TIMESTAMP),
        college_name = COALESCE(EXCLUDED.college_name, ambassador_profiles.college_name),
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    // Also update campus_program_applications activation timestamp
    await sql`
      UPDATE campus_program_applications
      SET 
        application_status = 'approved',
        activation_at = CURRENT_TIMESTAMP,
        approval_at = COALESCE(approval_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId};
    `;

    return rows[0] as AmbassadorProfile;
  }

  /**
   * Update ambassador onboarding step (1 to 7)
   */
  async updateStep(userId: string, step: number): Promise<AmbassadorProfile> {
    const rows = await sql`
      INSERT INTO ambassador_profiles (
        user_id, current_stage, current_step, approval_status, credits, level, status
      ) VALUES (
        ${userId}, ${JourneyStage.INTRO}, ${step}, 'none', 0, 1, 'active'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        current_step = ${step},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return rows[0] as AmbassadorProfile;
  }

  /**
   * Record "Maybe Later" status
   */
  async optOutProgram(userId: string): Promise<AmbassadorProfile> {
    const rows = await sql`
      INSERT INTO ambassador_profiles (
        user_id, current_stage, current_step, status
      ) VALUES (
        ${userId}, ${JourneyStage.NOT_JOINED}, 6, 'maybe_later'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        status = 'maybe_later',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return rows[0] as AmbassadorProfile;
  }

  /**
   * Update ambassador profile journey stage
   */
  async updateStage(userId: string, stage: JourneyStage, step?: number, approvalStatus?: string): Promise<AmbassadorProfile> {
    const stepVal = step !== undefined ? step : 1;
    const rows = await sql`
      UPDATE ambassador_profiles 
      SET 
        current_stage = ${stage},
        current_step = ${stepVal},
        approval_status = COALESCE(${approvalStatus || null}, approval_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *;
    `;
    return rows[0] as AmbassadorProfile;
  }

  /**
   * Add credits to user profile & append to ledger
   */
  async addCredits(userId: string, programId: string, amount: number, type: 'earned' | 'bonus' | 'redeemed', description: string, referenceId?: string): Promise<number> {
    await sql`
      INSERT INTO credit_ledger (user_id, program_id, amount, type, description, reference_id)
      VALUES (${userId}, ${programId}, ${amount}, ${type}, ${description}, ${referenceId || null});
    `;

    const sumResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM credit_ledger WHERE user_id = ${userId};
    `;
    const newTotal = parseInt(sumResult[0]?.total || '0', 10);

    await sql`
      UPDATE ambassador_profiles 
      SET credits = ${newTotal}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId};
    `;

    return newTotal;
  }

  /**
   * Get learning progress entries for user
   */
  async getLearningProgress(userId: string, programId: string = 'campus_awareness'): Promise<LearningProgress[]> {
    const rows = await sql`
      SELECT * FROM program_learning_progress 
      WHERE user_id = ${userId} AND program_id = ${programId}
      ORDER BY created_at ASC;
    `;
    return rows as LearningProgress[];
  }

  /**
   * Alias for getLearningProgress
   */
  async getModuleProgress(userId: string, programId: string = 'campus_awareness'): Promise<LearningProgress[]> {
    return this.getLearningProgress(userId, programId);
  }

  /**
   * Complete or update a learning module
   */
  async upsertModuleProgress(userId: string, programId: string, moduleId: string, status: 'in_progress' | 'completed', quizData?: Record<string, any>): Promise<LearningProgress> {
    const jsonQuiz = JSON.stringify(quizData || {});
    const rows = await sql`
      INSERT INTO program_learning_progress (
        user_id, program_id, module_id, completion_status, completed_at, quiz_data
      ) VALUES (
        ${userId}, ${programId}, ${moduleId}, ${status}, 
        ${status === 'completed' ? sql`CURRENT_TIMESTAMP` : null}, 
        ${jsonQuiz}::jsonb
      )
      ON CONFLICT (user_id, program_id, module_id) DO UPDATE SET
        completion_status = ${status},
        completed_at = EXCLUDED.completed_at,
        quiz_data = EXCLUDED.quiz_data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return rows[0] as LearningProgress;
  }

  /**
   * Get total credits from ledger
   */
  async getLedgerEntries(userId: string): Promise<CreditLedgerEntry[]> {
    const rows = await sql`
      SELECT * FROM credit_ledger 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC;
    `;
    return rows as CreditLedgerEntry[];
  }
}
