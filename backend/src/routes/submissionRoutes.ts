import { Router } from 'express';
import { submissionController } from '../controllers/submissionController.js';

const router = Router();

// GET /api/activity-submissions/analytics & GET /api/admin/submissions/analytics - Aggregated analytics
router.get('/activity-submissions/analytics', submissionController.getAnalytics);
router.get('/admin/submissions/analytics', submissionController.getAnalytics);

// GET /api/activity-submissions/activities - Distinct submitted activities across all pages
router.get('/activity-submissions/activities', submissionController.getActivities);
router.get('/admin/submissions/activities', submissionController.getActivities);

// GET, POST, DELETE /api/admin/reviewers - Reviewers CRUD
router.get('/admin/reviewers', submissionController.getReviewers);
router.post('/admin/reviewers', submissionController.addReviewer);
router.delete('/admin/reviewers/:name', submissionController.deleteReviewer);

// GET /api/activity-submissions/export/csv - Download all submissions in CSV format (Excel & Google Sheets compatible)
router.get('/activity-submissions/export/csv', submissionController.exportSubmissionsCSV);

// POST /api/activity-submissions - Create new activity submission
router.post('/activity-submissions', submissionController.createSubmission);

// GET /api/activity-submissions - List submissions with pagination, filtering, searching & sorting
router.get('/activity-submissions', submissionController.getAllSubmissions);

// GET /api/activity-submissions/user/:userId - Get submissions for specific user
router.get('/activity-submissions/user/:userId', submissionController.getSubmissionsByUser);

// GET /api/activity-submissions/:id - Get single submission by ID
router.get('/activity-submissions/:id', submissionController.getSubmissionById);

// PATCH & PUT /api/activity-submissions/:id/review - Review submission (approve, reject, add notes)
router.patch('/activity-submissions/:id/review', submissionController.reviewSubmission);
router.put('/activity-submissions/:id/review', submissionController.reviewSubmission);
router.patch('/activity-submissions/:id/status', submissionController.reviewSubmission);

export default router;
