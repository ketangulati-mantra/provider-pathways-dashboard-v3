import { Request, Response } from 'express';
import { corporateService } from '../services/corporateService.js';

export async function getCorporateStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.query.userId as string) || (req as any).user?.id || (req as any).user?.user_id;

    if (!userId) {
      res.status(400).json({ success: false, error: 'Missing userId parameter' });
      return;
    }

    const data = await corporateService.getStatus(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[getCorporateStatus] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to get corporate program status' });
  }
}

export async function postCorporateInterest(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, error: 'Missing userId in request body' });
      return;
    }

    const data = await corporateService.setInterest(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[postCorporateInterest] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to express interest' });
  }
}

export async function submitCorporateApplication(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    const userId = body.userId || body.user_id;

    // Referrer details
    const fullName = body.fullName || body.full_name;
    const email = body.email;
    const countryCode = body.countryCode || body.country_code || '+91';
    const phone = body.phone;
    const relationship = body.relationship;
    const connectionReach = body.connectionReach || body.connection_reach || body.connectionStrength || body.connection_strength;

    // Company details
    const companyName = body.companyName || body.company_name;
    const companyWebsite = body.website || body.companyWebsite || body.company_website;
    const companyCountry = body.companyCountry || body.company_country || body.country || 'India';
    const companyCity = body.companyCity || body.company_city || body.city;
    const companyIndustry = body.industry || body.companyIndustry || body.company_industry || body.industries;
    const companySize = body.companySize || body.company_size;

    // Introduction details
    const decisionMaker = body.decisionMaker || body.decision_maker || body.contactRole || body.companyConnections || body.company_connections;
    const introMethod = body.introMethod || body.intro_method || body.introductionMethod;
    const directContactPerson = body.directContactPerson || body.direct_contact_person;
    const companyNeeds = body.companyNeeds || body.company_needs || body.needs;
    const referralContext = body.referralContext || body.referral_context || body.additionalContext || body.motivation;
    const termsAccepted = body.termsAccepted ?? body.terms_accepted ?? true;

    // Backend Validation: Essential Referral Fields
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: userId'
      });
      return;
    }

    if (!fullName || !email || !phone) {
      res.status(400).json({
        success: false,
        error: 'Missing required referrer details (fullName, email, phone)'
      });
      return;
    }

    if (!companyName || !companyCountry || !companyIndustry) {
      res.status(400).json({
        success: false,
        error: 'Missing required company details (companyName, companyCountry, industry)'
      });
      return;
    }

    const data = await corporateService.submitApplication({
      user_id: userId,
      full_name: fullName,
      email,
      country_code: countryCode,
      phone,
      relationship,
      connection_reach: connectionReach,

      company_name: companyName,
      company_website: companyWebsite,
      company_country: companyCountry,
      company_city: companyCity,
      company_industry: companyIndustry,
      company_size: companySize,

      decision_maker: decisionMaker,
      intro_method: introMethod,
      direct_contact_person: directContactPerson,
      company_needs: companyNeeds,
      referral_context: referralContext,

      city: companyCity || companyCountry,
      company_connections: decisionMaker,
      industries: companyIndustry,
      motivation: referralContext || 'Corporate Referral Introduction',
      availability: introMethod || 'Direct introduction',
      terms_accepted: termsAccepted
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error('[submitCorporateApplication] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit referral application' });
  }
}

export async function getAdminCorporateApplications(req: Request, res: Response): Promise<void> {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    const data = await corporateService.getAdminApplications(status, search);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[getAdminCorporateApplications] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to get admin corporate applications' });
  }
}

export async function patchCorporateReviewer(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { reviewer, status } = req.body;

    if (!id) {
      res.status(400).json({ success: false, error: 'Missing application id' });
      return;
    }

    await corporateService.updateReviewer(id, reviewer, status);
    res.json({ success: true });
  } catch (err) {
    console.error('[patchCorporateReviewer] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to update reviewer' });
  }
}

export async function getLearningProgress(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.query.userId as string) || (req as any).user?.id || (req as any).user?.user_id;

    if (!userId) {
      res.status(400).json({ success: false, error: 'Missing userId parameter' });
      return;
    }

    const data = await corporateService.getLearningProgress(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[getLearningProgress] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to get learning progress' });
  }
}

export async function postCompleteModule(req: Request, res: Response): Promise<void> {
  try {
    const { userId, moduleId, timeSpentSeconds } = req.body;

    if (!userId || !moduleId) {
      res.status(400).json({ success: false, error: 'Missing userId or moduleId' });
      return;
    }

    const data = await corporateService.completeModule(userId, moduleId, timeSpentSeconds || 0);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[postCompleteModule] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to complete module' });
  }
}

export async function postNavigateModule(req: Request, res: Response): Promise<void> {
  try {
    const { userId, moduleId, timeSpentSeconds } = req.body;

    if (!userId || !moduleId) {
      res.status(400).json({ success: false, error: 'Missing userId or moduleId' });
      return;
    }

    const data = await corporateService.updateCurrentModule(userId, moduleId, timeSpentSeconds || 0);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[postNavigateModule] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to update current module' });
  }
}
