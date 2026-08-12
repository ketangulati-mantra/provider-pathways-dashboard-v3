import { sql } from '../db/client.js';

export interface CreateSubmissionInput {
  userId: string;
  service?: string;
  lessonId: string;
  activityTitle: string;
  submissionType: string;
  formData?: Record<string, any> | any;
  submissionData?: Record<string, any> | any;
}

export interface GetSubmissionsQuery {
  page?: number;
  limit?: number;
  status?: string;
  reviewedBy?: string;
  lessonId?: string;
  submissionType?: string;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface ReviewSubmissionInput {
  status?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export const submissionService = {
  async createSubmission(input: CreateSubmissionInput) {
    const {
      userId,
      service,
      lessonId,
      activityTitle,
      submissionType,
      formData = {},
      submissionData = {},
    } = input;

    const jsonFormData = typeof formData === 'string' ? formData : JSON.stringify(formData);
    const jsonSubmissionData = typeof submissionData === 'string' ? submissionData : JSON.stringify(submissionData);

    const result = await sql`
      INSERT INTO activity_submissions (
        user_id,
        service,
        lesson_id,
        activity_title,
        submission_type,
        form_data,
        submission_data,
        status,
        reviewed_by,
        created_at,
        updated_at
      )
      VALUES (
        ${userId},
        ${service || null},
        ${lessonId},
        ${activityTitle},
        ${submissionType},
        ${jsonFormData}::jsonb,
        ${jsonSubmissionData}::jsonb,
        'pending',
        'Unassigned',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *;
    `;

    return result[0];
  },

  async getAnalytics(options: { range?: string; startDate?: string; endDate?: string }) {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const range = options.range || 'this_month';

    if (range === 'custom' && options.startDate) {
      start = new Date(options.startDate);
      start.setHours(0, 0, 0, 0);
      if (options.endDate) {
        end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
      }
    } else if (range === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (range === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    } else if (range === 'this_week') {
      const current = new Date();
      const day = current.getDay();
      const diff = current.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(current.setDate(diff));
      start.setHours(0, 0, 0, 0);
    } else if (range === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (range === 'last_month') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (range === 'last_3_months') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
    } else if (range === 'last_6_months') {
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);
    } else if (range === 'last_12_months') {
      start = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    let submissions: any[] = [];
    try {
      submissions = await sql`
        SELECT * FROM activity_submissions
        WHERE created_at >= ${startISO}::timestamptz AND created_at <= ${endISO}::timestamptz
        ORDER BY created_at DESC;
      `;
    } catch (err) {
      console.warn('[submissionService] Error querying submissions for analytics:', err);
    }

    let completions: any[] = [];
    try {
      completions = await sql`
        SELECT * FROM user_activity_completions
        WHERE completed_at >= ${startISO}::timestamptz AND completed_at <= ${endISO}::timestamptz
        ORDER BY completed_at DESC;
      `;
    } catch (err) {
      // Table might not exist yet or empty
    }

    const providerIds = new Set<string>();
    submissions.forEach((s: any) => { if (s.user_id) providerIds.add(String(s.user_id)); });
    completions.forEach((c: any) => { if (c.user_id) providerIds.add(String(c.user_id)); });

    const activityCountMap = new Map<string, { activityId: string; activityName: string; count: number }>();

    completions.forEach((c: any) => {
      const lessonId = c.lesson_id || 'unknown';
      const name = c.metadata?.activityTitle || c.metadata?.title || lessonId;
      const key = lessonId;
      if (!activityCountMap.has(key)) {
        activityCountMap.set(key, { activityId: lessonId, activityName: name, count: 0 });
      }
      activityCountMap.get(key)!.count += 1;
    });

    submissions.forEach((s: any) => {
      const lessonId = s.lesson_id || 'unknown';
      const name = s.activity_title || lessonId;
      const key = lessonId;
      if (!activityCountMap.has(key)) {
        activityCountMap.set(key, { activityId: lessonId, activityName: name, count: 0 });
      }
      const existsInCompletions = completions.some((c: any) => c.user_id === s.user_id && c.lesson_id === s.lesson_id);
      if (!existsInCompletions) {
        activityCountMap.get(key)!.count += 1;
      }
    });

    const videoSubmissionMap = new Map<string, { activityId: string; activityName: string; total: number; uploaded: number; skipped: number }>();

    submissions.forEach((s: any) => {
      const subType = (s.submission_type || '').toLowerCase();
      const formData = typeof s.form_data === 'object' && s.form_data ? s.form_data : {};
      const hasVideo = subType === 'video_introduction' || !!formData.videoUrl || !!formData.video_url;
      const isSkipped = subType === 'skipped_video' || formData.skipped === true;

      if (hasVideo || isSkipped || subType.includes('video') || (s.lesson_id || '').includes('market-yourself') || (s.lesson_id || '').includes('growth')) {
        const lessonId = s.lesson_id || 'video-activity';
        const name = s.activity_title || lessonId;
        const key = lessonId;

        if (!videoSubmissionMap.has(key)) {
          videoSubmissionMap.set(key, { activityId: lessonId, activityName: name, total: 0, uploaded: 0, skipped: 0 });
        }

        const item = videoSubmissionMap.get(key)!;
        item.total += 1;
        if (hasVideo) {
          item.uploaded += 1;
        } else if (isSkipped) {
          item.skipped += 1;
        }
      }
    });

    const activityCompletionsList = Array.from(activityCountMap.values()).sort((a, b) => b.count - a.count);
    const videoSubmissionsList = Array.from(videoSubmissionMap.values()).sort((a, b) => b.total - a.total);

    const totalCompletions = activityCompletionsList.reduce((acc, curr) => acc + curr.count, 0);
    const totalVideoSubmissions = videoSubmissionsList.reduce((acc, curr) => acc + curr.total, 0);

    return {
      overview: {
        totalCompletions,
        uniqueProviders: providerIds.size,
        activitiesCompleted: activityCompletionsList.length,
        videoSubmissions: totalVideoSubmissions,
      },
      activityCompletions: activityCompletionsList,
      videoSubmissions: videoSubmissionsList,
    };
  },

  async getReviewers() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_reviewers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Get reviewers from users table where is_reviewer = TRUE
      const userReviewers = await sql`
        SELECT DISTINCT name, email
        FROM users
        WHERE is_reviewer IS TRUE AND name IS NOT NULL AND name != ''
        ORDER BY name ASC;
      `;

      const existing = await sql`SELECT name FROM admin_reviewers ORDER BY id ASC;`;
      const set = new Set<string>();
      set.add('Unassigned');

      userReviewers.forEach((r: any) => { if (r.name && r.name.trim()) set.add(r.name.trim()); });
      existing.forEach((r: any) => { if (r.name && r.name.trim()) set.add(r.name.trim()); });

      return Array.from(set);
    } catch (err) {
      console.error('[submissionService] Error fetching reviewers:', err);
      return ['Unassigned', 'Ketan', 'Team Member', 'Pooja', 'Mantra Admin'];
    }
  },

  async addReviewer(name: string) {
    const trimmed = name ? name.trim() : '';
    if (!trimmed) throw new Error('Reviewer name cannot be empty');

    await sql`
      CREATE TABLE IF NOT EXISTS admin_reviewers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      INSERT INTO admin_reviewers (name)
      VALUES (${trimmed})
      ON CONFLICT (name) DO NOTHING;
    `;

    // Mark is_reviewer = TRUE in users table
    try {
      await sql`
        UPDATE users
        SET is_reviewer = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(name) = ${trimmed.toLowerCase()} OR LOWER(email) = ${trimmed.toLowerCase()};
      `;
    } catch (err) {
      console.error('[submissionService] Error updating users.is_reviewer:', err);
    }

    return this.getReviewers();
  },

  async deleteReviewer(name: string) {
    const trimmed = name ? name.trim() : '';
    if (!trimmed || trimmed === 'Unassigned') {
      throw new Error('Cannot delete default Unassigned option');
    }

    try {
      await sql`
        DELETE FROM admin_reviewers
        WHERE LOWER(name) = ${trimmed.toLowerCase()};
      `;
    } catch (e) {}

    // Mark is_reviewer = FALSE in users table
    try {
      await sql`
        UPDATE users
        SET is_reviewer = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(name) = ${trimmed.toLowerCase()} OR LOWER(email) = ${trimmed.toLowerCase()};
      `;
    } catch (err) {
      console.error('[submissionService] Error unsetting users.is_reviewer:', err);
    }

    return this.getReviewers();
  },

  async getUniqueActivities() {
    try {
      const result = await sql`
        SELECT DISTINCT lesson_id, activity_title
        FROM activity_submissions
        WHERE activity_title IS NOT NULL OR lesson_id IS NOT NULL;
      `;
      const map = new Map<string, { key: string; title: string }>();
      result.forEach((row: any) => {
        const title = row.activity_title || row.lesson_id;
        if (title && title.trim()) {
          const key = row.lesson_id || title;
          if (!map.has(title)) {
            map.set(title, { key, title });
          }
        }
      });
      return Array.from(map.values());
    } catch (err) {
      console.error('[submissionService] Error fetching unique activities:', err);
      return [];
    }
  },

  async getAllSubmissions(options: GetSubmissionsQuery = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const offset = (page - 1) * limit;

    const status = options.status?.trim();
    const reviewedBy = options.reviewedBy?.trim();
    const lessonId = options.lessonId?.trim();
    const submissionType = options.submissionType?.trim();
    const search = options.search?.trim();

    let submissions = await sql`
      SELECT * FROM activity_submissions
      ORDER BY created_at DESC;
    `;

    if (status) {
      submissions = submissions.filter((s: any) => (s.status || 'pending').toLowerCase() === status.toLowerCase());
    }

    if (reviewedBy) {
      if (reviewedBy === 'Unassigned') {
        submissions = submissions.filter((s: any) => !s.reviewed_by || s.reviewed_by === 'Unassigned');
      } else {
        submissions = submissions.filter((s: any) => s.reviewed_by?.toLowerCase() === reviewedBy.toLowerCase());
      }
    }

    if (lessonId) {
      submissions = submissions.filter((s: any) => s.lesson_id === lessonId);
    }

    if (submissionType) {
      submissions = submissions.filter((s: any) => s.submission_type === submissionType);
    }

    if (search) {
      const q = search.toLowerCase();
      submissions = submissions.filter((s: any) =>
        s.activity_title?.toLowerCase().includes(q) ||
        s.user_id?.toLowerCase().includes(q) ||
        s.lesson_id?.toLowerCase().includes(q) ||
        (s.reviewed_by || '').toLowerCase().includes(q) ||
        JSON.stringify(s.form_data || {}).toLowerCase().includes(q) ||
        JSON.stringify(s.submission_data || {}).toLowerCase().includes(q)
      );
    }

    const sortBy = options.sortBy || 'created_at';
    const isAsc = options.order?.toUpperCase() === 'ASC';

    submissions.sort((a: any, b: any) => {
      let valA = a[sortBy] ?? a.created_at;
      let valB = b[sortBy] ?? b.created_at;
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    const totalRecords = submissions.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const paginatedSubmissions = submissions.slice(offset, offset + limit);

    return {
      submissions: paginatedSubmissions,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  },

  async getSubmissionById(id: string) {
    const rows = await sql`
      SELECT * FROM activity_submissions 
      WHERE id::text = ${id};
    `;
    return rows[0] || null;
  },

  async getSubmissionsByUser(userId: string) {
    return await sql`
      SELECT * FROM activity_submissions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;
  },

  async reviewSubmission(id: string, input: ReviewSubmissionInput) {
    const { status, reviewedBy, reviewNotes } = input;

    const cleanStatus = status ? String(status).toLowerCase().trim() : null;
    const cleanReviewer = reviewedBy !== undefined ? String(reviewedBy).trim() : null;
    const cleanNotes = reviewNotes !== undefined ? String(reviewNotes).trim() : null;
    const stringId = String(id).trim();

    let rows;
    if (cleanStatus && cleanReviewer !== null) {
      rows = await sql`
        UPDATE activity_submissions
        SET status = ${cleanStatus}, reviewed_by = ${cleanReviewer}, updated_at = CURRENT_TIMESTAMP
        WHERE id::text = ${stringId}
        RETURNING *;
      `;
    } else if (cleanStatus) {
      rows = await sql`
        UPDATE activity_submissions
        SET status = ${cleanStatus}, updated_at = CURRENT_TIMESTAMP
        WHERE id::text = ${stringId}
        RETURNING *;
      `;
    } else if (cleanReviewer !== null) {
      rows = await sql`
        UPDATE activity_submissions
        SET reviewed_by = ${cleanReviewer}, updated_at = CURRENT_TIMESTAMP
        WHERE id::text = ${stringId}
        RETURNING *;
      `;
    } else if (cleanNotes !== null) {
      rows = await sql`
        UPDATE activity_submissions
        SET review_notes = ${cleanNotes}, updated_at = CURRENT_TIMESTAMP
        WHERE id::text = ${stringId}
        RETURNING *;
      `;
    } else {
      rows = await sql`SELECT * FROM activity_submissions WHERE id::text = ${stringId};`;
    }

    return rows[0] || null;
  }
};
