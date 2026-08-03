import { Request, Response } from 'express';
import { corporateService } from '../services/corporateService.js';

export async function getCorporateStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.query.userId as string) || 'default_user';
    const data = await corporateService.getStatus(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[getCorporateStatus] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch status' });
  }
}

export async function postCorporateInterest(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, error: 'userId is required' });
      return;
    }
    const data = await corporateService.setInterest(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[postCorporateInterest] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to set interest' });
  }
}

export async function submitCorporateApplication(req: Request, res: Response): Promise<void> {
  try {
    const {
      userId,
      fullName,
      email,
      countryCode,
      phone,
      city,
      companyConnections,
      industries,
      linkedinUrl,
      previousExperience,
      motivation,
      availability,
      termsAccepted
    } = req.body;

    if (!userId || !city || !motivation || !availability) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields (userId, city, motivation, availability)'
      });
      return;
    }

    const data = await corporateService.submitApplication({
      user_id: userId,
      full_name: fullName,
      email,
      country_code: countryCode,
      phone,
      city,
      company_connections: companyConnections,
      industries: typeof industries === 'object' ? JSON.stringify(industries) : industries,
      linkedin_url: linkedinUrl,
      previous_experience: previousExperience,
      motivation,
      availability,
      terms_accepted: termsAccepted ?? true
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error('[submitCorporateApplication] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
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
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
}
