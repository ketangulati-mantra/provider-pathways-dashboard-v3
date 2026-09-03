import { Router } from 'express';
import {
  getCampusStatus,
  submitApplicationForm,
  getMasterColleges,
  getMasterCourses,
  getMasterCities,
  getDashboardData,
  saveStep,
  optOutProgram,
  joinProgram,
  completeLearningModule,
  submitApplication,
  getApplicationStatus,
  getTimeline,
  patchApplication,
  resubmitApplication,
  getAdminApplications,
  getAdminApplicationDetails,
  postAdminReview,
  getAdminAnalytics,
  resubmitApplicationVersion
} from '../controllers/campusController.js';
import { authenticateAdmin } from '../../middleware/authenticateAdmin.js';

const router = Router();

// Master Data Search Endpoints
router.get('/master/colleges', getMasterColleges);
router.get('/master/courses', getMasterCourses);
router.get('/master/cities', getMasterCities);

// Status & Dashboard Endpoints
router.get('/me', getCampusStatus);
router.get('/dashboard', getDashboardData);

// Application Form Endpoints (Phase 2.5 & Versioning)
router.post('/application', submitApplicationForm);
router.post('/application/resubmit-version', resubmitApplicationVersion);

// Phase 3.5 Review Lifecycle & Timeline Endpoints
router.get('/application-status', getApplicationStatus);
router.get('/timeline', getTimeline);
router.patch('/application', patchApplication);
router.post('/application/resubmit', resubmitApplication);

// Phase 4 Dedicated Admin Module Endpoints
router.get('/admin/applications', authenticateAdmin, getAdminApplications);
router.get('/admin/applications/:id', authenticateAdmin, getAdminApplicationDetails);
router.post('/admin/review', authenticateAdmin, postAdminReview);
router.get('/admin/analytics', authenticateAdmin, getAdminAnalytics);

// Journey State Endpoints
router.post('/step', saveStep);
router.post('/opt-out', optOutProgram);
router.post('/join', joinProgram);
router.post('/learning', completeLearningModule);
router.post('/submit-application', submitApplication);

export default router;
