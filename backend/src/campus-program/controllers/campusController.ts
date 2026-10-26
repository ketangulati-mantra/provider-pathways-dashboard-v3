import { Request, Response, NextFunction } from 'express';
import { CampusService } from '../services/campusService.js';
import { MASTER_COLLEGES, MASTER_COURSES, MASTER_CITIES } from '../masterData/masterData.js';

const campusService = new CampusService();

/**
 * GET /api/campus-program/master/colleges?query=...
 */
export async function getMasterColleges(req: Request, res: Response) {
  try {
    const query = (req.query.query as string || '').toLowerCase().trim();
    
    const localMatches = query
      ? MASTER_COLLEGES.filter(c => c.toLowerCase().includes(query))
      : MASTER_COLLEGES.slice(0, 15);

    let externalMatches: string[] = [];

    if (query.length >= 2) {
      try {
        const [hipoRes, wikiRes] = await Promise.allSettled([
          fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`),
          fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query + ' college')}&limit=8&namespace=0&format=json`)
        ]);

        if (hipoRes.status === 'fulfilled' && hipoRes.value.ok) {
          const hipoData: any = await hipoRes.value.json();
          if (Array.isArray(hipoData)) {
            const hipoNames = hipoData.slice(0, 10).map((u: any) => u.name);
            externalMatches.push(...hipoNames);
          }
        }

        if (wikiRes.status === 'fulfilled' && wikiRes.value.ok) {
          const wikiData: any = await wikiRes.value.json();
          if (Array.isArray(wikiData) && Array.isArray(wikiData[1])) {
            const wikiTitles = wikiData[1].filter((t: string) => t.toLowerCase().includes('college') || t.toLowerCase().includes('university') || t.toLowerCase().includes('institute'));
            externalMatches.push(...wikiTitles);
          }
        }
      } catch (err) {
        console.warn('[CampusController] External college search fallback to local data:', err);
      }
    }

    const combinedSet = new Set([...localMatches, ...externalMatches]);
    const combined = Array.from(combinedSet).sort((a, b) => a.localeCompare(b)).slice(0, 25);

    res.json({ success: true, data: combined });
  } catch (error) {
    const fallbackSorted = MASTER_COLLEGES.slice(0, 15).sort((a, b) => a.localeCompare(b));
    res.json({ success: true, data: fallbackSorted });
  }
}

/**
 * GET /api/campus-program/master/courses?query=...
 */
export async function getMasterCourses(req: Request, res: Response) {
  try {
    const query = (req.query.query as string || '').toLowerCase().trim();
    
    const localMatches = query
      ? MASTER_COURSES.filter(c => c.toLowerCase().includes(query))
      : MASTER_COURSES.slice(0, 20);

    let externalMatches: string[] = [];

    if (query.length >= 2) {
      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query + ' degree')}&limit=6&namespace=0&format=json`);
        if (wikiRes.ok) {
          const wikiData: any = await wikiRes.json();
          if (Array.isArray(wikiData) && Array.isArray(wikiData[1])) {
            externalMatches = wikiData[1];
          }
        }
      } catch (err) {
        console.warn('[CampusController] External course search fallback:', err);
      }
    }

    const combinedSet = new Set([...localMatches, ...externalMatches]);
    const combined = Array.from(combinedSet).sort((a, b) => a.localeCompare(b)).slice(0, 25);

    res.json({ success: true, data: combined });
  } catch (error) {
    const fallbackSorted = MASTER_COURSES.slice(0, 15).sort((a, b) => a.localeCompare(b));
    res.json({ success: true, data: fallbackSorted });
  }
}

/**
 * GET /api/campus-program/master/cities?query=...
 */
export async function getMasterCities(req: Request, res: Response) {
  try {
    const query = (req.query.query as string || '').toLowerCase().trim();
    
    const matches = query
      ? MASTER_CITIES.filter(c => c.toLowerCase().includes(query))
      : MASTER_CITIES.slice(0, 20);

    const sorted = Array.from(new Set(matches)).sort((a, b) => a.localeCompare(b)).slice(0, 25);
    res.json({ success: true, data: sorted });
  } catch (error) {
    const fallbackSorted = MASTER_CITIES.slice(0, 15).sort((a, b) => a.localeCompare(b));
    res.json({ success: true, data: fallbackSorted });
  }
}

/**
 * GET /api/campus-program/me
 */
export async function getCampusStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.query.userId as string) || 'anonymous_user';
    const status = await campusService.getUserStatus(userId);
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/campus-program/dashboard
 */
export async function getDashboardData(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.query.userId as string) || 'anonymous_user';
    const dashboardData = await campusService.getDashboardData(userId);
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/application
 */
export async function submitApplicationForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, ...appData } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    const updatedStatus = await campusService.submitApplicationForm(effectiveUserId, { user_id: effectiveUserId, ...appData });
    res.json({
      success: true,
      message: 'Application form submitted successfully and saved in database',
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/step
 */
export async function saveStep(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, step } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    const updatedStatus = await campusService.saveOnboardingStep(effectiveUserId, step);
    res.json({
      success: true,
      message: `Step ${step} saved successfully`,
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/opt-out
 */
export async function optOutProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    const profile = await campusService.optOutProgram(effectiveUserId);
    res.json({
      success: true,
      message: 'User opted out of program onboarding (Maybe Later)',
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/join
 */
export async function joinProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, collegeName } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    await campusService.joinProgram(effectiveUserId, collegeName);
    const updatedStatus = await campusService.getUserStatus(effectiveUserId);
    res.json({
      success: true,
      message: 'Successfully joined Campus Ambassador Program Engine',
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/learning
 */
export async function completeLearningModule(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, moduleId, quizAnswers } = req.body;
    const effectiveUserId = userId || 'anonymous_user';

    if (!moduleId) {
      return res.status(400).json({ success: false, error: 'moduleId is required' });
    }

    const updatedStatus = await campusService.completeModule(effectiveUserId, moduleId, quizAnswers);
    res.json({
      success: true,
      message: `Completed module ${moduleId}`,
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/submit-application
 */
export async function submitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, collegeName } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    const updatedStatus = await campusService.submitApplication(effectiveUserId, collegeName);
    res.json({
      success: true,
      message: 'Application submitted for ambassador review',
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

// ==============================================================================
// PHASE 3.5 API ENDPOINTS
// ==============================================================================

export async function getApplicationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.query.userId as string) || 'anonymous_user';
    const status = await campusService.getUserStatus(userId);
    res.json({
      success: true,
      data: {
        application: status.application,
        journeyStage: status.journeyStage,
        timeline: status.timeline,
        requestedFields: status.requestedFields,
        profile: status.profile
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.query.userId as string) || 'anonymous_user';
    const timeline = await campusService.getApplicationTimeline(userId);
    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    next(error);
  }
}

export async function patchApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, status, reviewerNotes, requestedFields, reviewerId } = req.body;
    const effectiveUserId = userId || 'anonymous_user';

    if (!status) {
      return res.status(400).json({ success: false, error: 'status is required' });
    }

    const updatedStatus = await campusService.reviewApplication(
      effectiveUserId,
      status,
      reviewerNotes,
      requestedFields,
      reviewerId || 'admin_reviewer'
    );

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

export async function resubmitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, ...updatedData } = req.body;
    const effectiveUserId = userId || 'anonymous_user';

    const updatedStatus = await campusService.resubmitApplication(effectiveUserId, updatedData);
    res.json({
      success: true,
      message: 'Application resubmitted successfully',
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}

// ==============================================================================
// PHASE 4 DEDICATED CAMPUS PROGRAM ADMIN API ENDPOINTS
// ==============================================================================

/**
 * GET /api/campus-program/admin/applications
 * Returns applications list with filters, status badges, and counts
 */
export async function getAdminApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const status = (req.query.status as string) || 'all';
    const search = (req.query.search as string) || '';
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '20', 10);

    const result = await campusService.getAdminApplications({ status, search, page, limit });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/campus-program/admin/applications/:id
 * Returns application details, version history, timeline, and audit logs
 */
export async function getAdminApplicationDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const applicationId = req.params.id;
    const details = await campusService.getApplicationDetailsWithHistory(applicationId);
    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/admin/review
 * Admin action handler (Approve, Reject with mandatory reason, Request Info)
 */
export async function postAdminReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { applicationId, action, reviewReason, reviewerNotes, requestedFields, reviewerId } = req.body;

    if (!applicationId || !action) {
      return res.status(400).json({ success: false, error: 'applicationId and action are required' });
    }

    if (action === 'reject' && (!reviewReason || !reviewReason.trim())) {
      return res.status(400).json({ success: false, error: 'Mandatory rejection reason is required when rejecting an application.' });
    }

    const result = await campusService.processAdminReview(
      applicationId,
      action,
      reviewReason,
      reviewerNotes,
      requestedFields,
      reviewerId || 'admin_reviewer'
    );

    res.json({
      success: true,
      message: `Successfully processed review action: ${action}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/campus-program/admin/mail-status
 * Manually update mail status for an application and track authenticated reviewer
 */
export async function patchAdminMailStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { applicationId, mailStatus } = req.body;
    const authReq = req as any;

    if (!applicationId || !mailStatus) {
      return res.status(400).json({ success: false, error: 'applicationId and mailStatus are required' });
    }

    const adminName = authReq.admin?.name || authReq.admin?.email || 'Admin';

    const updated = await campusService.updateApplicationMailStatus(
      String(applicationId),
      String(mailStatus),
      adminName,
      'admin'
    );

    res.json({
      success: true,
      message: 'Mail status updated successfully',
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update mail status'
    });
  }
}

/**
 * GET /api/campus-program/admin/analytics
 */
export async function getAdminAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await campusService.getAdminAnalyticsSummary();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/campus-program/application/resubmit-version
 * Resubmit new application version when rejected or updating (Phase 4 Versioning)
 */
export async function resubmitApplicationVersion(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, ...formData } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    const updatedStatus = await campusService.createNewApplicationVersion(effectiveUserId, formData);
    res.json({
      success: true,
      message: 'New application version submitted successfully',
      data: updatedStatus
    });
  } catch (error) {
    next(error);
  }
}
