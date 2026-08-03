import { corporateRepository, CorporateApplicationRecord } from '../repositories/corporateRepository.js';

export class CorporateService {
  async getStatus(userId: string) {
    const app = await corporateRepository.getByUserId(userId);
    if (!app) {
      return {
        applicationStatus: 'NOT_APPLIED',
        application: null
      };
    }
    return {
      applicationStatus: app.application_status || 'submitted',
      application: app
    };
  }

  async setInterest(userId: string) {
    const app = await corporateRepository.setInterest(userId);
    return {
      applicationStatus: app.application_status,
      application: app
    };
  }

  async submitApplication(appData: CorporateApplicationRecord) {
    const app = await corporateRepository.saveApplication(appData);
    return {
      applicationStatus: app.application_status,
      application: app
    };
  }

  async getAdminApplications(statusFilter?: string, searchQuery?: string) {
    const apps = await corporateRepository.getAllApplications(statusFilter, searchQuery);
    return {
      applications: apps,
      totalCount: apps.length
    };
  }
}

export const corporateService = new CorporateService();
