import React, { useState, useEffect } from 'react';
import { getCurrentUserId, MANTRA_CONFIG, goToDashboard } from '../../mantra';
import OnboardingWizardContainer from './onboarding/OnboardingWizardContainer';
import CampusApplicationModal from './application/CampusApplicationModal';
import ApplicationSuccessModal from './application/ApplicationSuccessModal';
import LearningScreen from './LearningScreen';
import UnderReviewScreen from './UnderReviewScreen';
import MoreInfoRequiredScreen from './MoreInfoRequiredScreen';
import RejectedScreen from './RejectedScreen';
import AmbassadorDashboard from './AmbassadorDashboard';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default function CampusProgramController({ onBack }) {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Application Modal, Learning Mode & Success Modal Controls
  const [showAppModal, setShowAppModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLearningMode, setShowLearningMode] = useState(false);

  const userId = getCurrentUserId();

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/campus-program/me?userId=${encodeURIComponent(userId)}`);
      const json = await res.json();

      if (json.success) {
        setStatusData(json.data);
      } else {
        setError(json.error || 'Failed to fetch campus program status');
      }
    } catch (err) {
      console.error('[CampusProgramController] Error loading status:', err);
      setError('Unable to connect to campus program backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [userId]);

  // Persist onboarding step directly in database
  const handleSaveStep = async (step) => {
    try {
      await fetch(`${API_BASE}/api/campus-program/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, step })
      });
    } catch (err) {
      console.error('[CampusProgramController] Error persisting step:', err);
    }
  };

  // Submit dedicated application form (Phase 2.5)
  const handleApplicationSubmit = async (appFormData) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE}/api/campus-program/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...appFormData })
      });
      const json = await res.json();
      if (json.success) {
        setStatusData(json.data);
        setShowAppModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('[CampusProgramController] Error submitting application:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle "Maybe Later" (Step 6 opt-out)
  const handleOptOut = async () => {
    try {
      await fetch(`${API_BASE}/api/campus-program/opt-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (onBack) {
        onBack();
      } else {
        goToDashboard();
      }
    } catch (err) {
      console.error('[CampusProgramController] Error opting out:', err);
    }
  };

  // Handle completing an onboarding module
  const handleCompleteModule = async (moduleId) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE}/api/campus-program/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId })
      });
      const json = await res.json();
      if (json.success) {
        setStatusData(json.data);
      }
    } catch (err) {
      console.error('[CampusProgramController] Error completing module:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle submitting application for review
  const handleSubmitApp = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE}/api/campus-program/submit-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const json = await res.json();
      if (json.success) {
        setStatusData(json.data);
      }
    } catch (err) {
      console.error('[CampusProgramController] Error submitting application:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Clean, Simple Skeleton Loader
  if (loading) {
    return (
      <div style={{ maxWidth: '1600px', margin: '20px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }} className="animate-fade-in">
        <style>{`
          @keyframes skeleton-shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          .simple-skeleton {
            animation: skeleton-shimmer 1.4s ease-in-out infinite;
            background: #e2e8f0;
            border-radius: 12px;
          }
        `}</style>

        {/* Top Control Bar Skeleton */}
        <div style={{ height: '64px', width: '100%' }} className="simple-skeleton" />

        {/* 2-Column Skeleton Grid matching Udemy Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <div style={{ height: '280px', width: '100%' }} className="simple-skeleton" />
            <div style={{ height: '180px', width: '100%' }} className="simple-skeleton" />
          </div>

          <div style={{ height: '476px', width: '100%' }} className="simple-skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '32px', background: '#ffffff', borderRadius: '16px', border: '1px solid #fee2e2', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Connection Error</div>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>{error}</p>
        <button onClick={loadStatus} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  const stage = statusData?.journeyStage || 'NOT_JOINED';
  const savedStep = statusData?.profile?.current_step || 1;

  // Render view based on database journey stage (Phase 3.5 Stage Router)
  const renderStageView = () => {
    if (showLearningMode) {
      return (
        <LearningScreen
          statusData={statusData}
          onCompleteModule={handleCompleteModule}
          onSubmitApp={() => {
            setShowLearningMode(false);
            setShowAppModal(true);
          }}
          isUpdating={isUpdating}
          onBack={() => setShowLearningMode(false)}
        />
      );
    }

    switch (stage) {
      case 'NOT_JOINED':
      case 'INTRO':
      case 'EXPRESS_INTEREST':
        return (
          <OnboardingWizardContainer
            initialStep={savedStep}
            onSaveStep={handleSaveStep}
            onOpenAppModal={() => setShowAppModal(true)}
            onOptOut={handleOptOut}
            onBack={onBack}
          />
        );

      case 'LEARNING':
        return (
          <LearningScreen
            statusData={statusData}
            onCompleteModule={handleCompleteModule}
            onSubmitApp={() => setShowAppModal(true)}
            isUpdating={isUpdating}
            onBack={onBack}
          />
        );

      case 'APPLICATION_SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <UnderReviewScreen
            statusData={statusData}
            onGoToLearning={() => setShowLearningMode(true)}
            onBack={onBack}
          />
        );

      case 'MORE_INFORMATION_REQUIRED':
        return (
          <MoreInfoRequiredScreen
            statusData={statusData}
            onResubmitSuccess={(updatedData) => {
              setStatusData(updatedData);
              setShowSuccessModal(true);
            }}
            onBack={onBack}
          />
        );

      case 'REJECTED':
        return (
          <RejectedScreen
            statusData={statusData}
            onResubmitVersionSuccess={(updatedData) => {
              setStatusData(updatedData);
              setShowSuccessModal(true);
            }}
            onBack={onBack}
          />
        );

      case 'APPROVED':
      case 'ACTIVE':
        return (
          <LearningScreen
            statusData={statusData}
            onCompleteModule={handleCompleteModule}
            onSubmitApp={() => setShowAppModal(true)}
            isUpdating={isUpdating}
            onBack={onBack}
          />
        );

      default:
        return (
          <OnboardingWizardContainer
            initialStep={1}
            onSaveStep={handleSaveStep}
            onOpenAppModal={() => setShowAppModal(true)}
            onOptOut={handleOptOut}
            onBack={onBack}
          />
        );
    }
  };

  return (
    <>
      {renderStageView()}

      {/* Phase 2.5 Campus Application Registration Modal */}
      <CampusApplicationModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
        onSubmitSuccess={handleApplicationSubmit}
        initialProfile={statusData?.profile}
      />

      {/* Application Submission Success Modal */}
      <ApplicationSuccessModal
        isOpen={showSuccessModal}
        onContinue={() => {
          setShowSuccessModal(false);
          setShowLearningMode(true);
        }}
        onReturnDashboard={() => {
          setShowSuccessModal(false);
          setShowLearningMode(false);
          if (onBack) onBack();
        }}
      />
    </>
  );
}
