import React, { useState, useEffect } from 'react';
import { getCurrentUserId, MANTRA_CONFIG, goToDashboard } from '../../mantra';
import CorporateLandingPage from './CorporateLandingPage';
import CorporateApplicationModal from './CorporateApplicationModal';
import CorporateApplicationSuccessModal from './CorporateApplicationSuccessModal';
import CorporateUnderReviewScreen from './CorporateUnderReviewScreen';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default function CorporateProgramController({ onBack }) {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal Controls
  const [showAppModal, setShowAppModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userId = getCurrentUserId();

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/corporate-program/me?userId=${encodeURIComponent(userId)}`);
      const json = await res.json();

      if (json.success) {
        setStatusData(json.data);
      } else {
        setError(json.error || 'Failed to fetch status');
      }
    } catch (err) {
      console.error('[CorporateProgramController] Error loading status:', err);
      setError('Unable to connect to corporate program backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [userId]);

  // Handle "YES, I'M INTERESTED" -> Save initial interest state in DB & Open Application Modal
  const handleExpressInterest = async () => {
    try {
      await fetch(`${API_BASE}/api/corporate-program/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err) {
      console.error('[CorporateProgramController] Error setting interest:', err);
    }
    setShowAppModal(true);
  };

  // Handle "NOT RIGHT NOW" -> Return to Tasks Dashboard without marking complete
  const handleOptOut = () => {
    if (onBack) {
      onBack();
    } else {
      goToDashboard();
    }
  };

  // Submit Application Form
  const handleApplicationSubmit = async (appFormData) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE}/api/corporate-program/application`, {
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
      console.error('[CorporateProgramController] Error submitting application:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: '#64748b', fontWeight: 700, fontSize: '0.9rem' }}>
        Loading Corporate Partner Program...
      </div>
    );
  }

  // If application is submitted & under review (and success modal is closed), show Under Review screen
  const appStatus = statusData?.applicationStatus;
  const isUnderReview = appStatus === 'submitted' || appStatus === 'under_review';

  if (isUnderReview && !showSuccessModal) {
    return (
      <CorporateUnderReviewScreen 
        onBack={onBack || goToDashboard} 
        application={statusData?.application} 
      />
    );
  }

  return (
    <>
      <CorporateLandingPage 
        onExpressInterest={handleExpressInterest}
        onOptOut={handleOptOut}
        onBack={onBack}
      />

      <CorporateApplicationModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
        onSubmit={handleApplicationSubmit}
        isUpdating={isUpdating}
        initialData={statusData?.application}
      />

      <CorporateApplicationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          loadStatus();
        }}
      />
    </>
  );
}
