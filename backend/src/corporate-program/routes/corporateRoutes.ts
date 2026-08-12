import { Router } from 'express';
import {
  getCorporateStatus,
  postCorporateInterest,
  submitCorporateApplication,
  getAdminCorporateApplications,
  patchCorporateReviewer,
  getLearningProgress,
  postCompleteModule,
  postNavigateModule
} from '../controllers/corporateController.js';

const router = Router();

router.get('/me', getCorporateStatus);
router.post('/interest', postCorporateInterest);
router.post('/application', submitCorporateApplication);
router.get('/admin/applications', getAdminCorporateApplications);
router.patch('/admin/applications/:id/reviewer', patchCorporateReviewer);

// Learning Academy Endpoints
router.get('/learning/progress', getLearningProgress);
router.post('/learning/complete', postCompleteModule);
router.post('/learning/navigate', postNavigateModule);

export default router;
