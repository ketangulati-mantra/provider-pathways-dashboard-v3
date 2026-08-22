import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  User,
  Hash
} from 'lucide-react';
import { Header, Button } from '../components';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { navigateToBankDetailsPage } from '../mantra/navigation';
import './BankDetailsLessonPage.css';

const LESSWN_ID = 'bank-details';
const REWARD_POINTS = 10;

export default function BankDetailsLessonPage({ onBack }) {
  const [hasOpenedBanking, setHasOpenedBanking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    lessonProgress,
    completedSteps,
    handleActionComplete
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const isCompleted = completedSteps?.actionDone || completedSteps?.celebrationShown;

  const handleOpenBankingSection = () => {
    setHasOpenedBanking(true);
    navigateToBankDetailsPage();
  };

  const handleFinalCompletion = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleActionComplete();
    } catch (err) {
      console.error('[BankDetails] Completion error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bank-details-page animate-fade-in">
      <Header
        title="Complete Your Bank Details"
        onBack={onBack}
        progress={lessonProgress}
        points={REWARD_POINTS}
        isCompleted={isCompleted}
      />

      <main className="bank-details-main">
        <div className="bank-details-container">
          
          <div className="bank-hero-card">
            <div className="bank-hero-badge-row">
              <div className="bank-tag">
                <Building2 size={13} />
                <span>Banking & Payouts</span>
              </div>
              <div className="bank-points-pill">
                +{REWARD_POINTS} Provider Points
              </div>
            </div>

            <h1 className="bank-hero-title">Complete Your Bank Details</h1>
            <p className="bank-hero-subtitle">
              Add your bank details to make sure your Mantra payments can be processed smoothly.
            </p>

            <div className="bank-hero-notice">
              <ShieldCheck size={18} className="bank-notice-icon" />
              <p>
                To receive payments from Mantra, you need to keep your bank details updated. Adding your bank information helps Mantra process eligible payments and payouts to your account without unnecessary delays.
              </p>
            </div>
          </div>

          <section className="bank-section">
            <h2 className="bank-section-title">Why add your bank details?</h2>
            <div className="bank-benefits-grid">
              
              <div className="bank-benefit-card">
                <div className="bank-benefit-icon-box blue">
                  <CreditCard size={22} />
                </div>
                <h3 className="bank-benefit-heading">Receive Payments</h3>
                <p className="bank-benefit-text">
                  Keep your payment information ready for processing.
                </p>
              </div>

              <div className="bank-benefit-card">
                <div className="bank-benefit-icon-box emerald">
                  <Clock size={22} />
                </div>
                <h3 className="bank-benefit-heading">Avoid Delays</h3>
                <p className="bank-benefit-text">
                  Accurate bank details help prevent payment processing issues.
                </p>
              </div>

              <div className="bank-benefit-card">
                <div className="bank-benefit-icon-box purple">
                  <Lock size={22} />
                </div>
                <h3 className="bank-benefit-heading">Keep Information Updated</h3>
                <p className="bank-benefit-text">
                  Make sure your banking information is correct and up to date.
                </p>
              </div>

            </div>
          </section>

          <section className="bank-section">
            <div className="bank-checklist-card">
              <div className="bank-checklist-header">
                <div className="bank-checklist-icon-wrap">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="bank-checklist-title">Before you begin</h2>
                  <p className="bank-checklist-desc">
                    Have your required bank information ready before opening the form.
                  </p>
                </div>
              </div>

              <div className="bank-fields-grid">
                <div className="bank-field-item">
                  <User size={16} className="field-icon" />
                  <span>Account holder name</span>
                </div>
                <div className="bank-field-item">
                  <Building2 size={16} className="field-icon" />
                  <span>Bank name</span>
                </div>
                <div className="bank-field-item">
                  <Hash size={16} className="field-icon" />
                  <span>Account number</span>
                </div>
                <div className="bank-field-item">
                  <ShieldCheck size={16} className="field-icon" />
                  <span>IFSC / relevant banking details</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bank-section">
            <div className="bank-action-card">
              
              {isCompleted ? (
                <div className="bank-completed-state animate-fade-in">
                  <div className="bank-success-icon-wrap">
                    <CheckCircle2 size={32} color="#10b981" />
                  </div>
                  <h3 className="bank-completed-title">Activity Completed</h3>
                  <p className="bank-completed-desc">
                    Your bank details activity is recorded. Your payments can be processed smoothly by Mantra.
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={onBack}
                    style={{ marginTop: '12px' }}
                  >
                    Return to Tasks
                  </Button>
                </div>
              ) : (
                <div className="bank-action-flow">
                  <div className="bank-step-guide">
                    <div className="bank-step-bubble">1</div>
                    <div className="bank-step-info">
                      <h3 className="bank-step-title">Ready to add your details?</h3>
                      <p className="bank-step-desc">
                        Open the Banking section to fill in and save your bank details on Mantra.
                      </p>
                    </div>
                  </div>

                  <div className="bank-buttons-container">
                    <Button
                      variant="primary"
                      onClick={handleOpenBankingSection}
                      className="bank-primary-btn"
                    >
                      <span>Add Bank Details </span>
                      <ExternalLink size={16} />
                    </Button>

                    <div className="bank-divider">
                      <span>After saving your details in the Banking section</span>
                    </div>

                    <div className="bank-step-guide step-two">
                      <div className="bank-step-bubble step-two-bubble">3</div>
                      <div className="bank-step-info">
                        <h4 className="bank-step-title">Mark as finished</h4>
                        <p className="bank-step-desc">
                          Once your details are entered in the banking form, confirm below to complete this pathway activity.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={hasOpenedBanking ? "primary" : "secondary"}
                      onClick={handleFinalCompletion}
                      disabled={isSubmitting}
                      className="bank-complete-btn"
                    >
                      {isSubmitting ? (
                        <span>Completingâ¦</span>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Mark Activity as Complete</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>

                    {!hasOpenedBanking && (
                      <p className="bank-hint-text">
                        <AlertCircle size={13} />
                        Please click "Add Bank Details" first to open and complete your banking form.
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
