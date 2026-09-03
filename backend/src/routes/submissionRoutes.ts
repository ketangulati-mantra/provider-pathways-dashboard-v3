import { Router } from 'express';
import { submissionController } from '../controllers/submissionController.js';
import { authenticateAdmin, authorizeUserOrAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

// GET /api/activity-submissions/analytics & GET /api/admin/submissions/analytics - Aggregated analytics (Admin Only)
router.get('/activity-submissions/analytics', authenticateAdmin, submissionController.getAnalytics);
router.get('/admin/submissions/analytics', authenticateAdmin, submissionController.getAnalytics);

// GET /api/activity-submissions/activities - Distinct submitted activities across all pages (Public metadata)
router.get('/activity-submissions/activities', submissionController.getActivities);
router.get('/admin/submissions/activities', authenticateAdmin, submissionController.getActivities);

// GET, POST, DELETE /api/admin/reviewers - Reviewers CRUD (Admin Only)
router.get('/admin/reviewers', authenticateAdmin, submissionController.getReviewers);
router.get('/admin/available-users', authenticateAdmin, submissionController.getAvailableUsers);
router.post('/admin/reviewers', authenticateAdmin, submissionController.addReviewer);
router.delete('/admin/reviewers/:name', authenticateAdmin, submissionController.deleteReviewer);

// GET /api/activity-submissions/export/csv - Download all submissions in CSV format (Admin Only)
router.get('/activity-submissions/export/csv', authenticateAdmin, submissionController.exportSubmissionsCSV);

// POST /api/activity-submissions - Create new activity submission (Provider Facing)
router.post('/activity-submissions', submissionController.createSubmission);

// GET /api/activity-submissions - List submissions with pagination, filtering, searching & sorting (Admin Only)
router.get('/activity-submissions', authenticateAdmin, submissionController.getAllSubmissions);

// GET /activity-submissions/user/:userId - Get submissions for specific user (Protected: Owner or Admin only)
router.get('/activity-submissions/user/:userId', authorizeUserOrAdmin, submissionController.getSubmissionsByUser);

// GET /api/activity-submissions/:id - Get single submission by ID (Admin Only)
router.get('/activity-submissions/:id', authenticateAdmin, submissionController.getSubmissionById);

// POST /api/activity-submissions/:id/claim - Claim submission for current logged in reviewer (Admin Only)
router.post('/activity-submissions/:id/claim', authenticateAdmin, submissionController.claimSubmission);

// PATCH & PUT /api/activity-submissions/:id/review - Review submission (approve, reject, add notes) (Admin Only)
router.patch('/activity-submissions/:id/review', authenticateAdmin, submissionController.reviewSubmission);
router.put('/activity-submissions/:id/review', authenticateAdmin, submissionController.reviewSubmission);
router.patch('/activity-submissions/:id/status', authenticateAdmin, submissionController.reviewSubmission);

export default router;
