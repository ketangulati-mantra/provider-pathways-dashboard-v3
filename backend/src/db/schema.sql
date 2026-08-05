-- ==============================================================================
-- Neon PostgreSQL Database Schema for Provider Pathways Platform
-- All tables include user_id tracking and created_at / updated_at timestamps.
-- ==============================================================================

-- 1. Automatic Timestamp Update Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    service VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Lesson Completions Table
CREATE TABLE IF NOT EXISTS lesson_completions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    service VARCHAR(50) NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    reward_points INT DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 4. User Progress Checkpoints Table
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    progress_percent INT DEFAULT 0,
    video_watched BOOLEAN DEFAULT FALSE,
    quiz_done BOOLEAN DEFAULT FALSE,
    checklist_done BOOLEAN DEFAULT FALSE,
    scenario_attempted BOOLEAN DEFAULT FALSE,
    action_done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_progress UNIQUE (user_id, lesson_id)
);

-- 5. Campus Ambassador Applications Table (Legacy)
CREATE TABLE IF NOT EXISTS campus_ambassador_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    college_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'interested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Certificate Logs Table
CREATE TABLE IF NOT EXISTS certificate_logs (
    id BIGSERIAL PRIMARY KEY,
    certificate_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    pathway_name VARCHAR(255) NOT NULL,
    certificate_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Generic Activity Submissions Table
CREATE TABLE IF NOT EXISTS activity_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    service VARCHAR(50),
    lesson_id VARCHAR(100) NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    submission_type VARCHAR(100) NOT NULL,
    form_data JSONB DEFAULT '{}'::jsonb,
    submission_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'pending',
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- PROGRAM ENGINE MODULE TABLES (Phase 1, Phase 3.5 & Phase 4 Versioning)
-- Normalized architecture for long-term programs (Campus Ambassador, etc.)
-- ==============================================================================

-- 8. Ambassador Profiles Table (Journey Stages & Ambassador Metadata)
CREATE TABLE IF NOT EXISTS ambassador_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    ambassador_id VARCHAR(50) UNIQUE,
    current_stage VARCHAR(50) DEFAULT 'NOT_JOINED',
    current_step INT DEFAULT 0,
    approval_status VARCHAR(50) DEFAULT 'none',
    credits INT DEFAULT 0,
    level INT DEFAULT 1,
    referral_code VARCHAR(50) UNIQUE,
    college_name VARCHAR(255),
    joined_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Program Learning Progress Table (Onboarding Modules & Quizzes)
CREATE TABLE IF NOT EXISTS program_learning_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    module_id VARCHAR(100) NOT NULL,
    completion_status VARCHAR(50) DEFAULT 'in_progress',
    completed_at TIMESTAMP WITH TIME ZONE,
    quiz_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_program_module UNIQUE (user_id, program_id, module_id)
);

-- 10. Credit Ledger Table (Individual Credit Transaction History)
CREATE TABLE IF NOT EXISTS credit_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    amount INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Program Missions Table (Future-ready Mission System)
CREATE TABLE IF NOT EXISTS program_missions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    mission_key VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'assigned',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    proof_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_program_mission UNIQUE (user_id, program_id, mission_key)
);

-- 12. Program Notifications Table (Future-ready Notifications)
CREATE TABLE IF NOT EXISTS program_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Program Certificates Table (Future-ready Certificate Issuance)
CREATE TABLE IF NOT EXISTS program_certificates (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    certificate_code VARCHAR(100) UNIQUE NOT NULL,
    certificate_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Campus Program Applications Table (Phase 2.5, Phase 3.5 & Phase 4 Versioning)
CREATE TABLE IF NOT EXISTS campus_program_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    full_name VARCHAR(255),
    email VARCHAR(255),
    country_code VARCHAR(20) DEFAULT '+1',
    phone VARCHAR(50),
    college VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    city VARCHAR(255) NOT NULL,
    motivation TEXT NOT NULL,
    availability VARCHAR(100) NOT NULL,
    linkedin_url TEXT,
    instagram_url TEXT,
    previous_experience TEXT,
    terms_accepted BOOLEAN DEFAULT TRUE,
    community_guidelines_accepted BOOLEAN DEFAULT TRUE,
    application_status VARCHAR(50) DEFAULT 'submitted',
    requested_info_fields JSONB DEFAULT '[]'::jsonb,
    resubmission_count INT DEFAULT 0,
    reviewer_notes TEXT,
    review_reason TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approval_at TIMESTAMP WITH TIME ZONE,
    activation_at TIMESTAMP WITH TIME ZONE,
    version INT DEFAULT 1,
    parent_application_id BIGINT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Campus Application Audit History Table (Phase 3.5 Immutable Lifecycle Tracking)
CREATE TABLE IF NOT EXISTS campus_application_audit_history (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(100) DEFAULT 'campus_awareness',
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255) DEFAULT 'system',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Provider Growth Toolkit Checklist Table (Phase 2 Toolkit Persistence)
CREATE TABLE IF NOT EXISTS provider_growth_checklist (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    item_key VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_growth_item UNIQUE (user_id, item_key)
);

-- 17. Provider Growth Missions Submissions & Progress Table (Phase 3 Engine)
CREATE TABLE IF NOT EXISTS provider_growth_missions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    mission_id VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'assigned', -- 'assigned', 'in_progress', 'pending_review', 'approved', 'rejected'
    verification_type VARCHAR(50) DEFAULT 'proof_url', -- 'proof_url', 'screenshot', 'text_explanation', 'manual'
    proof_url TEXT,
    proof_text TEXT,
    xp_reward INT DEFAULT 50,
    credit_reward INT DEFAULT 10,
    rejection_reason TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_growth_mission UNIQUE (user_id, mission_id)
);

-- 18. Provider Growth User Stats Table (XP, Level, Credits)
CREATE TABLE IF NOT EXISTS provider_growth_stats (
    user_id VARCHAR(255) PRIMARY KEY,
    xp INT DEFAULT 0,
    credits INT DEFAULT 0,
    level VARCHAR(50) DEFAULT 'Starter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Provider Growth Analytics Cache Table (Phase 4 Analytics & Metrics)
CREATE TABLE IF NOT EXISTS provider_growth_analytics_cache (
    user_id VARCHAR(255) PRIMARY KEY,
    growth_score INT DEFAULT 82,
    profile_views INT DEFAULT 1420,
    bookings_count INT DEFAULT 48,
    reviews_count INT DEFAULT 12,
    backlinks_count INT DEFAULT 8,
    traffic_sources JSONB DEFAULT '{"LinkedIn":35, "Google":28, "Instagram":18, "Website":12, "Direct":7}'::jsonb,
    channel_progress JSONB DEFAULT '{"LinkedIn":100, "Instagram":75, "Website":50, "SEO":40, "Reviews":60}'::jsonb,
    monthly_trends JSONB DEFAULT '[{"month":"May","views":820,"bookings":24},{"month":"Jun","views":1100,"bookings":35},{"month":"Jul","views":1420,"bookings":48}]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Provider Growth Activity Timeline Table (Phase 4 Real-time Event Feed)
CREATE TABLE IF NOT EXISTS provider_growth_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) DEFAULT 'mission_completed',
    icon_type VARCHAR(50) DEFAULT 'trophy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Provider Growth Hub Configurable Programs Table (Phase 5 Unified Engine)
CREATE TABLE IF NOT EXISTS provider_growth_hub_programs (
    program_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'book-open',
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. Provider Growth Hub Central Resource Library Table (Phase 5 Unified Engine)
CREATE TABLE IF NOT EXISTS provider_growth_hub_resources (
    resource_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) DEFAULT 'document',
    download_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. Provider XP Ledger Table (Phase 6 Ledger - Never overwrite XP)
CREATE TABLE IF NOT EXISTS provider_xp_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'mission', 'learning', 'referral', 'review', 'profile'
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. Provider Achievements & Badges Unlocked Table (Phase 6 Engine)
CREATE TABLE IF NOT EXISTS provider_achievements_unlocked (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    badge_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Growth',
    rarity VARCHAR(50) DEFAULT 'Common', -- 'Common', 'Rare', 'Epic', 'Legendary'
    xp_earned INT DEFAULT 50,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- 25. Provider Reputation History Table (Phase 6 Reputation Engine)
CREATE TABLE IF NOT EXISTS provider_reputation_history (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    reputation_score INT DEFAULT 850,
    learning_score INT DEFAULT 90,
    professionalism_score INT DEFAULT 95,
    reviews_score INT DEFAULT 80,
    activity_score INT DEFAULT 85,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);





