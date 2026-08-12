import { CampusRepository } from '../repositories/campusRepository.js';
import { JourneyStage, CampusProgramStatusResponse, AmbassadorProfile, CampusApplication, ApplicationTimelineItem, AdminApplicationsQuery, AdminApplicationsResponse } from '../models/types.js';

export class CampusService {
  private repo: CampusRepository;

  constructor() {
    this.repo = new CampusRepository();
  }

  /**
   * Notification Infrastructure Event Trigger (Phase 3.5 Infrastructure Only)
   */
  async triggerNotificationEvent(userId: string, eventType: string, payload: Record<string, any>) {
    console.log(`[Notification Infrastructure] Event Logged: ${eventType} for User: ${userId}`, payload);
  }

  /**
   * Phase 4 Admin Applications List Query
   */
  async getAdminApplications(queryParams: AdminApplicationsQuery): Promise<AdminApplicationsResponse> {
    return await this.repo.getAdminApplications(queryParams);
  }

  /**
   * Phase 4 Admin Application Details + Audit History + Version History
   */
  async getApplicationDetailsWithHistory(applicationId: string) {
    const app = await this.repo.findApplicationById(applicationId);
    if (!app) {
      throw new Error('Application not found');
    }

    const profile = await this.repo.findProfileByUserId(app.user_id);
    const timeline = await this.getApplicationTimeline(app.user_id);
    const auditHistory = await this.repo.getAuditHistory(app.user_id);
    const versionHistory = await this.repo.getApplicationVersionHistory(app.user_id);

    return {
      application: app,
      profile,
      timeline,
      auditHistory,
      versionHistory
    };
  }

  /**
   * Phase 4 Admin Review Action Handler (Approve, Reject with mandatory reason, Request Info)
   */
  async processAdminReview(
    applicationId: string,
    action: 'approve' | 'reject' | 'request_info' | 'under_review',
    reviewReason?: string,
    reviewerNotes?: string,
    requestedFields?: string[],
    reviewerId?: string
  ) {
    const currentApp = await this.repo.findApplicationById(applicationId);
    if (!currentApp) {
      throw new Error('Application not found');
    }

    if (action === 'reject' && (!reviewReason || !reviewReason.trim())) {
      throw new Error('Mandatory rejection reason is required when rejecting an application.');
    }

    const isUnassigned = !reviewerId || reviewerId === 'Unassigned' || reviewerId === 'unassigned';

    let mappedStatus: 'submitted' | 'approved' | 'rejected' | 'more_info_required' | 'under_review' = isUnassigned ? 'submitted' : 'under_review';
    if (action === 'approve') mappedStatus = 'approved';
    else if (action === 'reject') mappedStatus = 'rejected';
    else if (action === 'request_info') mappedStatus = 'more_info_required';
    else if ((action as string) === 'submitted') mappedStatus = 'submitted';
    else if (action === 'under_review') mappedStatus = isUnassigned ? 'submitted' : 'under_review';

    // Preserve custom reviewer name if already assigned or passed
    const effectiveReviewer = isUnassigned 
      ? 'Unassigned' 
      : ((reviewerId && reviewerId.trim() && reviewerId !== 'admin_reviewer')
          ? reviewerId.trim()
          : (currentApp.reviewed_by && currentApp.reviewed_by.trim() && currentApp.reviewed_by !== 'admin_reviewer' ? currentApp.reviewed_by.trim() : 'Admin Reviewer'));

    const updatedApp = await this.repo.adminReviewApplication(
      applicationId,
      currentApp.user_id,
      mappedStatus,
      reviewerNotes,
      reviewReason,
      requestedFields,
      effectiveReviewer
    );

    if (mappedStatus === 'approved') {
      await this.repo.activateAmbassadorProfile(currentApp.user_id, currentApp.college);
      await this.triggerNotificationEvent(currentApp.user_id, 'APPLICATION_APPROVED', { ambassadorId: currentApp.user_id });
    } else if (mappedStatus === 'more_info_required') {
      await this.repo.updateStage(currentApp.user_id, JourneyStage.MORE_INFORMATION_REQUIRED, 6, 'more_info_required');
      await this.triggerNotificationEvent(currentApp.user_id, 'INFORMATION_REQUESTED', { requestedFields, notes: reviewerNotes });
    } else if (mappedStatus === 'rejected') {
      await this.repo.updateStage(currentApp.user_id, JourneyStage.REJECTED, 6, 'rejected');
      await this.triggerNotificationEvent(currentApp.user_id, 'APPLICATION_REJECTED', { reason: reviewReason });
    } else if (mappedStatus === 'under_review') {
      await this.repo.updateStage(currentApp.user_id, JourneyStage.UNDER_REVIEW, 6, 'under_review');
    }

    return await this.getApplicationDetailsWithHistory(applicationId);
  }

  /**
   * Phase 4 Admin Analytics Summary
   */
  async getAdminAnalyticsSummary() {
    const listRes = await this.repo.getAdminApplications({ limit: 1000 });
    const { statusCounts, total } = listRes;

    const activationRate = total > 0 ? Math.round((statusCounts.approved / total) * 100) : 0;

    return {
      totalApplications: total,
      pendingCount: statusCounts.submitted + statusCounts.under_review,
      approvedCount: statusCounts.approved,
      rejectedCount: statusCounts.rejected,
      moreInfoCount: statusCounts.more_info_required,
      activationRate: `${activationRate}%`
    };
  }

  /**
   * Create a new application version for resubmission (Phase 4 Multi-Version Support)
   */
  async createNewApplicationVersion(userId: string, formData: Partial<CampusApplication>): Promise<CampusProgramStatusResponse> {
    const newApp = await this.repo.createNewApplicationVersion(userId, formData);
    await this.repo.updateStage(userId, JourneyStage.APPLICATION_SUBMITTED, 6, 'pending');
    await this.triggerNotificationEvent(userId, 'APPLICATION_RESUBMITTED_NEW_VERSION', { formData });
    const status = await this.getUserStatus(userId);
    return {
      ...status,
      application: newApp
    };
  }

  /**
   * Get application form submitted by user
   */
  async getApplication(userId: string): Promise<CampusApplication | null> {
    return await this.repo.findApplicationByUserId(userId);
  }

  /**
   * Generate animated progress timeline for application review lifecycle (Phase 3.5 & 4)
   */
  async getApplicationTimeline(userId: string): Promise<ApplicationTimelineItem[]> {
    const app = await this.repo.findApplicationByUserId(userId);
    const profile = await this.repo.findProfileByUserId(userId);

    const appStatus = app?.application_status || 'submitted';
    const profileStage = profile?.current_stage || JourneyStage.UNDER_REVIEW;

    const timeline: ApplicationTimelineItem[] = [
      {
        id: 't1',
        title: 'Application Submitted',
        description: `Official application (v${app?.version || 1}) received by review team.`,
        status: 'completed',
        timestamp: app?.submitted_at || profile?.created_at || null
      },
      {
        id: 't2',
        title: 'Under Review',
        description: 'Application details and institutional credentials being verified.',
        status: (appStatus === 'submitted' || appStatus === 'under_review') ? 'current' :
                (appStatus === 'approved' || profileStage === JourneyStage.ACTIVE || profileStage === JourneyStage.APPROVED) ? 'completed' :
                appStatus === 'more_info_required' ? 'action_required' :
                appStatus === 'rejected' ? 'rejected' : 'completed',
        timestamp: app?.reviewed_at || null
      },
      {
        id: 't3',
        title: 'Approval & Verification',
        description: appStatus === 'more_info_required' ? 'Action Required: Additional details requested by reviewer.' :
                     appStatus === 'rejected' ? `Application not approved: ${app?.review_reason || 'See review feedback.'}` :
                     'Final committee sign-off and clinical credential verification.',
        status: (appStatus === 'approved' || profileStage === JourneyStage.ACTIVE || profileStage === JourneyStage.APPROVED) ? 'completed' :
                appStatus === 'more_info_required' ? 'action_required' :
                appStatus === 'rejected' ? 'rejected' : 'upcoming',
        timestamp: app?.approval_at || null
      },
      {
        id: 't4',
        title: 'Activation & Dashboard Access',
        description: 'Ambassador ID & unique referral code issued. Dashboard access granted.',
        status: (profileStage === JourneyStage.ACTIVE || profileStage === JourneyStage.APPROVED) ? 'completed' : 'upcoming',
        timestamp: app?.activation_at || profile?.joined_date || null
      }
    ];

    return timeline;
  }

  /**
   * Get full campus program status response for user (Phase 3.5 & 4 Extended)
   */
  async getUserStatus(userId: string): Promise<CampusProgramStatusResponse> {
    let profile = await this.repo.findProfileByUserId(userId);
    
    // Auto-create default profile if user does not exist
    if (!profile) {
      profile = await this.repo.createProfile(userId, JourneyStage.NOT_JOINED, '');
    }

    const creditBalance = await this.repo.getCreditBalance(userId);
    const moduleProgress = await this.repo.getModuleProgress(userId, 'campus_awareness');
    const existingApp = await this.repo.findApplicationByUserId(userId);
    const timeline = await this.getApplicationTimeline(userId);

    const defaultModules = [
      {
        moduleId: 'mod_1_advocacy',
        title: 'Student Mental Health Advocacy',
        description: 'Learn the core principles of student mental health advocacy on campus.',
        completed: false
      },
      {
        moduleId: 'mod_2_support',
        title: 'Free Listener Support Protocols',
        description: 'Understand how to guide students to 24/7 confidential listener support.',
        completed: false
      },
      {
        moduleId: 'mod_3_therapy',
        title: 'Subsidized Therapy & Campaign Execution',
        description: 'Learn how to organize mental health awareness campaigns and refer students for therapy.',
        completed: false
      }
    ];

    const availableModules = defaultModules.map(dm => {
      const found = moduleProgress.find((p: any) => p.module_id === dm.moduleId);
      return {
        ...dm,
        completed: found ? found.completion_status === 'completed' : false,
        completedAt: found?.completed_at
      };
    });

    const isEligibleForCert = availableModules.every(m => m.completed);
    const certEarned = isEligibleForCert && (profile.approval_status === 'approved' || profile.current_stage === JourneyStage.APPROVED || profile.current_stage === JourneyStage.ACTIVE);

    // Sync database stage if app is under review
    let effectiveStage = profile.current_stage as JourneyStage;
    if (existingApp?.application_status === 'more_info_required') {
      effectiveStage = JourneyStage.MORE_INFORMATION_REQUIRED;
    } else if (existingApp?.application_status === 'rejected') {
      effectiveStage = JourneyStage.REJECTED;
    } else if (existingApp?.application_status === 'approved' || profile.current_stage === JourneyStage.ACTIVE) {
      effectiveStage = JourneyStage.ACTIVE;
    }

    return {
      userId,
      profile: {
        ...profile,
        credits: creditBalance
      },
      journeyStage: effectiveStage,
      learningProgress: moduleProgress,
      creditBalance,
      application: existingApp,
      timeline,
      requestedFields: existingApp?.requested_info_fields || [],
      certificate: {
        eligible: isEligibleForCert,
        earned: certEarned,
        issuedDate: certEarned ? (typeof profile.updated_at === 'string' ? profile.updated_at.split('T')[0] : new Date(profile.updated_at).toISOString().split('T')[0]) : null
      },
      availableModules
    };
  }

  /**
   * Submit application form entries to DB (Phase 2.5)
   */
  async submitApplicationForm(userId: string, appData: any): Promise<CampusProgramStatusResponse> {
    await this.repo.createOrUpdateApplication(appData);
    await this.repo.updateStage(userId, JourneyStage.APPLICATION_SUBMITTED, 6);
    
    // Award 50 credits welcome bonus in ledger for submitting registration
    await this.repo.addCredits(
      userId,
      'campus_awareness',
      50,
      'bonus',
      'Welcome Bonus for submitting Campus Ambassador Application'
    );

    await this.triggerNotificationEvent(userId, 'APPLICATION_SUBMITTED', { email: appData.email, name: appData.full_name });

    return await this.getUserStatus(userId);
  }

  /**
   * Review application status (Phase 3.5 Admin/Reviewer Endpoint)
   */
  async reviewApplication(
    userId: string,
    newStatus: 'under_review' | 'more_info_required' | 'approved' | 'rejected',
    reviewerNotes?: string,
    requestedFields?: string[],
    reviewerId: string = 'admin_reviewer'
  ): Promise<CampusProgramStatusResponse> {
    const app = await this.repo.findApplicationByUserId(userId);
    if (!app || !app.id) {
      throw new Error('Application not found for user');
    }
    const updatedApp = await this.repo.adminReviewApplication(
      String(app.id),
      userId,
      newStatus,
      reviewerNotes,
      undefined,
      requestedFields,
      reviewerId
    );

    if (newStatus === 'approved') {
      const app = await this.repo.findApplicationByUserId(userId);
      await this.repo.activateAmbassadorProfile(userId, app?.college);
      await this.triggerNotificationEvent(userId, 'APPLICATION_APPROVED', { ambassadorId: userId });
    } else if (newStatus === 'more_info_required') {
      await this.repo.updateStage(userId, JourneyStage.MORE_INFORMATION_REQUIRED, 6, 'more_info_required');
      await this.triggerNotificationEvent(userId, 'INFORMATION_REQUESTED', { requestedFields });
    } else if (newStatus === 'rejected') {
      await this.repo.updateStage(userId, JourneyStage.REJECTED, 6, 'rejected');
      await this.triggerNotificationEvent(userId, 'APPLICATION_REJECTED', { notes: reviewerNotes });
    } else if (newStatus === 'under_review') {
      await this.repo.updateStage(userId, JourneyStage.UNDER_REVIEW, 6, 'pending');
      await this.triggerNotificationEvent(userId, 'APPLICATION_UNDER_REVIEW', {});
    }

    return await this.getUserStatus(userId);
  }

  /**
   * Resubmit application after requested info update (Phase 3.5)
   */
  async resubmitApplication(userId: string, updatedData: Partial<CampusApplication>): Promise<CampusProgramStatusResponse> {
    await this.repo.resubmitApplication(userId, updatedData);
    await this.repo.updateStage(userId, JourneyStage.APPLICATION_SUBMITTED, 6, 'pending');
    await this.triggerNotificationEvent(userId, 'APPLICATION_RESUBMITTED', { updatedData });
    return await this.getUserStatus(userId);
  }

  /**
   * Get aggregated dashboard payload for Phase 3 hub
   */
  async getDashboardData(userId: string) {
    const status = await this.getUserStatus(userId);
    const ledger = await this.repo.getLedgerEntries(userId);

    const impactStats = {
      studentsReached: 42,
      listenerReferrals: 12,
      therapyReferrals: 5,
      workshopsConducted: 2,
      campusesContacted: 1,
      successfulPartnerships: 1,
      certificatesEarned: 1,
      creditsEarned: status.creditBalance
    };

    const roadmapMilestones = [
      { id: 'm1', label: 'Joined Initiative', completed: true, date: 'Day 1' },
      { id: 'm2', label: 'Completed Orientation', completed: status.availableModules.every(m => m.completed), date: 'Day 2' },
      { id: 'm3', label: 'Application Approved', completed: status.journeyStage === JourneyStage.APPROVED || status.journeyStage === JourneyStage.ACTIVE || status.profile.approval_status === 'approved', date: 'Day 3' },
      { id: 'm4', label: 'First Student Referral', completed: true, date: 'Day 4' },
      { id: 'm5', label: '10 Students Helped', completed: true, date: 'Day 5' },
      { id: 'm6', label: 'First Campus Workshop', completed: false, date: 'Upcoming' },
      { id: 'm7', label: 'Campus Champion Leader', completed: false, date: 'Target' }
    ];

    const nextMission = {
      id: 'mission-1',
      title: 'Share Referral Link with 5 Students',
      reward: 150,
      difficulty: 'Easy',
      estimatedMinutes: 5,
      progressPercent: 60,
      ctaText: 'Start Mission'
    };

    const recentActivity = ledger.map(l => ({
      id: l.id,
      title: l.description,
      amount: l.amount,
      type: l.type,
      timestamp: l.created_at
    }));

    const referralSummary = {
      referralCode: status.profile.referral_code || 'CAMPUS_ACTIVE',
      referralLink: `https://mantracare.org/campus?ref=${status.profile.referral_code || 'CAMPUS_ACTIVE'}`,
      clicks: 84,
      registrations: 12,
      bookings: 5,
      creditsEarned: status.creditBalance
    };

    const certificates = [
      { id: 'cert-1', title: 'Campus Mental Health Advocate', code: `CERT_${userId.substring(0, 6).toUpperCase()}`, earned: true, issuedDate: '2026-07-30' },
      { id: 'cert-2', title: 'Senior Workshop Leader Credential', code: 'CERT_PENDING', earned: false, progressPercent: 50 }
    ];

    const badges = [
      { id: 'b1', name: 'First Referral', desc: 'Referred 1st student for listener support', unlocked: true, icon: '🎯' },
      { id: 'b2', name: 'Mental Health Advocate', desc: 'Completed orientation curriculum', unlocked: status.availableModules.every(m => m.completed), icon: '🛡️' },
      { id: 'b3', name: 'Workshop Leader', desc: 'Conducted 1st campus workshop', unlocked: false, icon: '🎤' },
      { id: 'b4', name: 'Community Builder', desc: 'Reached 50+ students on campus', unlocked: false, icon: '🤝' },
      { id: 'b5', name: 'Campus Hero', desc: 'Earned 1,000+ ledger credits', unlocked: false, icon: '⭐' }
    ];

    const programResources = [
      { id: 'res-1', title: 'Campus Marketing Kit', type: 'PDF Guide', url: '#' },
      { id: 'res-2', title: 'Screening Event Posters', type: 'Print Assets', url: '#' },
      { id: 'res-3', title: 'WhatsApp Outreach Templates', type: 'Text Pack', url: '#' },
      { id: 'res-4', title: 'Email Broadcast Copy', type: 'Template', url: '#' },
      { id: 'res-5', title: 'Workshop Presentation Slides', type: 'PPTX Deck', url: '#' }
    ];

    return {
      userId,
      profile: status.profile,
      journeyStage: status.journeyStage,
      impactStats,
      roadmapMilestones,
      nextMission,
      recentActivity,
      referralSummary,
      certificates,
      badges,
      programResources
    };
  }

  /**
   * Persist current onboarding step (1 to 7) directly in database
   */
  async saveOnboardingStep(userId: string, step: number): Promise<CampusProgramStatusResponse> {
    const validStep = Math.min(Math.max(step, 1), 7);
    await this.repo.updateStep(userId, validStep);
    return await this.getUserStatus(userId);
  }

  /**
   * Handle "Maybe Later" selection (Step 6 opt-out)
   */
  async optOutProgram(userId: string): Promise<AmbassadorProfile> {
    return await this.repo.optOutProgram(userId);
  }

  /**
   * User completes Step 7 -> Advances stage to LEARNING & awards welcome credits
   */
  async joinProgram(userId: string, collegeName?: string): Promise<AmbassadorProfile> {
    let profile = await this.repo.findProfileByUserId(userId);
    
    if (!profile) {
      profile = await this.repo.createProfile(userId, JourneyStage.LEARNING, collegeName);
    } else {
      profile = await this.repo.updateStage(userId, JourneyStage.LEARNING, 7);
      if (collegeName) {
        await this.repo.createProfile(userId, JourneyStage.LEARNING, collegeName);
      }
    }

    await this.repo.addCredits(
      userId,
      'campus_awareness',
      50,
      'bonus',
      'Welcome Bonus for completing Campus Ambassador Onboarding Journey'
    );

    return (await this.repo.findProfileByUserId(userId))!;
  }

  /**
   * Complete an onboarding learning module.
   * Grants 50 points to the provider and marks task as APPROVED after completing all 3 modules!
   */
  async completeModule(userId: string, moduleId: string, quizAnswers?: Record<string, any>): Promise<CampusProgramStatusResponse> {
    await this.repo.upsertModuleProgress(userId, 'campus_awareness', moduleId, 'completed', quizAnswers);

    const statusBefore = await this.getUserStatus(userId);
    const allCompleted = statusBefore.availableModules.every(m => m.completed);

    if (allCompleted) {
      const ledger = await this.repo.getLedgerEntries(userId);
      const alreadyAwarded = ledger.some(l => l.description.includes('All 3 Orientation Modules'));
      
      if (!alreadyAwarded) {
        await this.repo.addCredits(
          userId,
          'campus_awareness',
          50,
          'earned',
          'Completed All 3 Orientation Modules (50 Points Granted)',
          'mod_all_bonus_50'
        );
      }

      // Mark task as completed (APPROVED)
      await this.repo.updateStage(userId, JourneyStage.APPROVED, 7, 'approved');
    }

    return await this.getUserStatus(userId);
  }

  /**
   * Submit application for review -> Advances stage to UNDER_REVIEW
   */
  async submitApplication(userId: string, collegeName?: string): Promise<CampusProgramStatusResponse> {
    await this.repo.updateStage(userId, JourneyStage.UNDER_REVIEW, 7, 'pending');
    await this.triggerNotificationEvent(userId, 'APPLICATION_SUBMITTED_FOR_REVIEW', {});
    return await this.getUserStatus(userId);
  }
}
