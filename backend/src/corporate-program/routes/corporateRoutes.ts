import { Router } from 'express';
import {
  getCorporateStatus,
  postCorporateInterest,
  submitCorporateApplication,
  getAdminCorporateApplications
} from '../controllers/corporateController.js';

const router = Router();

router.get('/me', getCorporateStatus);
router.post('/interest', postCorporateInterest);
router.post('/application', submitCorporateApplication);
router.get('/admin/applications', getAdminCorporateApplications);

export default router;
