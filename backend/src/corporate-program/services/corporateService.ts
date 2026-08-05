import { corporateRepository, CorporateApplicationRecord } from '../repositories/corporateRepository.js';

const TOTAL_MODULES = 10;

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

  // ── Learning Academy Methods ──

  async getLearningProgress(userId: string) {
    const progress = await corporateRepository.getLearningProgress(userId);
    if (!progress) {
      return {
        currentModuleId: 'corp_mod_1',
        completedModuleIds: [],
        progressPercent: 0,
        timeSpentSeconds: 0,
        lastAccessedAt: null
      };
    }
    const completed = Array.isArray(progress.completed_module_ids)
      ? progress.completed_module_ids
      : (typeof progress.completed_module_ids === 'string' ? JSON.parse(progress.completed_module_ids) : []);
    return {
      currentModuleId: progress.current_module_id || 'corp_mod_1',
      completedModuleIds: completed,
      progressPercent: progress.progress_percent || 0,
      timeSpentSeconds: progress.time_spent_seconds || 0,
      lastAccessedAt: progress.last_accessed_at
    };
  }

  async completeModule(userId: string, moduleId: string, timeSpentSeconds: number = 0) {
    const existing = await this.getLearningProgress(userId);
    const completed = [...new Set([...existing.completedModuleIds, moduleId])];
    const progressPercent = Math.round((completed.length / TOTAL_MODULES) * 100);

    // Determine next module
    const currentNum = parseInt(moduleId.replace('corp_mod_', ''), 10);
    const nextModuleId = currentNum < TOTAL_MODULES ? `corp_mod_${currentNum + 1}` : moduleId;

    const record = await corporateRepository.upsertLearningProgress(
      userId, nextModuleId, completed, progressPercent, timeSpentSeconds
    );

    const retCompleted = Array.isArray(record.completed_module_ids)
      ? record.completed_module_ids
      : (typeof record.completed_module_ids === 'string' ? JSON.parse(record.completed_module_ids) : []);

    return {
      currentModuleId: record.current_module_id,
      completedModuleIds: retCompleted,
      progressPercent: record.progress_percent,
      timeSpentSeconds: record.time_spent_seconds,
      lastAccessedAt: record.last_accessed_at
    };
  }

  async updateCurrentModule(userId: string, moduleId: string, timeSpentSeconds: number = 0) {
    const existing = await this.getLearningProgress(userId);
    const record = await corporateRepository.upsertLearningProgress(
      userId, moduleId, existing.completedModuleIds, existing.progressPercent, timeSpentSeconds
    );

    const retCompleted = Array.isArray(record.completed_module_ids)
      ? record.completed_module_ids
      : (typeof record.completed_module_ids === 'string' ? JSON.parse(record.completed_module_ids) : []);

    return {
      currentModuleId: record.current_module_id,
      completedModuleIds: retCompleted,
      progressPercent: record.progress_percent,
      timeSpentSeconds: record.time_spent_seconds,
      lastAccessedAt: record.last_accessed_at
    };
  }
}

export const corporateService = new CorporateService();
