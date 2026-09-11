/**
 * Campus Ambassador Program Journey Stages (Phase 3.5 & 4 Extended)
 */
export enum JourneyStage {
  NOT_JOINED = 'NOT_JOINED',
  INTRO = 'INTRO',
  EXPRESS_INTEREST = 'EXPRESS_INTEREST',
  LEARNING = 'LEARNING',
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  MORE_INFORMATION_REQUIRED = 'MORE_INFORMATION_REQUIRED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE'
}

export interface AmbassadorProfile {
  id: string;
  user_id: string;
  ambassador_id?: string;
  current_stage: JourneyStage;
  current_step: number;
  approval_status: 'none' | 'pending' | 'approved' | 'rejected' | 'more_info_required';
  credits: number;
  level: number;
  referral_code?: string;
  college_name?: string;
  joined_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CampusApplication {
  id?: string;
  user_id: string;
  program_id?: string;
  full_name?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  college: string;
  course: string;
  year: string;
  city: string;
  motivation: string;
  availability: string;
  linkedin_url?: string;
  instagram_url?: string;
  previous_experience?: string;
  terms_accepted?: boolean;
  community_guidelines_accepted?: boolean;
  application_status?: string;
  requested_info_fields?: string[] | any;
  resubmission_count?: number;
  reviewer_notes?: string;
  review_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  approval_at?: string;
  activation_at?: string;
  version?: number;
  submitted_at?: string;
  updated_at?: string;
  latest_email_status?: string | null;
  latest_email_template?: string | null;
  latest_email_sent_at?: string | null;
  latest_email_sender?: string | null;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  program_id: string;
  module_id: string;
  completion_status: 'in_progress' | 'completed';
  completed_at?: string;
  quiz_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreditLedgerEntry {
  id: string;
  user_id: string;
  program_id: string;
  amount: number;
  type: 'earned' | 'bonus' | 'redeemed';
  description: string;
  reference_id?: string;
  created_at: string;
}

export interface ApplicationTimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected' | 'action_required';
  timestamp?: string | null;
}

export interface AuditHistoryEntry {
  id: string;
  application_id?: string;
  user_id: string;
  program_id: string;
  from_status?: string;
  to_status: string;
  changed_by: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CampusProgramStatusResponse {
  userId: string;
  profile: AmbassadorProfile;
  journeyStage: JourneyStage;
  learningProgress: LearningProgress[];
  creditBalance: number;
  application?: CampusApplication | null;
  timeline?: ApplicationTimelineItem[];
  requestedFields?: string[];
  certificate?: {
    eligible: boolean;
    earned: boolean;
    issuedDate?: string | null;
  };
  availableModules: Array<{
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
}

export interface AdminApplicationsQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminApplicationsResponse {
  applications: CampusApplication[];
  total: number;
  page: number;
  limit: number;
  statusCounts: {
    all: number;
    submitted: number;
    under_review: number;
    approved: number;
    rejected: number;
    more_info_required: number;
  };
}
