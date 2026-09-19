import { useState, useEffect, useRef } from 'react';
import { completeLesson, getCurrentUserId, goToDashboard, handleExit } from '../mantra';
import { useToast } from '../components';

/**
 * Shared hook to manage progress state for all lessons.
 * 
 * Rules:
 * - Automatically calculates equal weights based on active features.
 * - For Video + Assessment ONLY, it enforces 50% / 50% weight.
 * - Video completion is triggered via `onCompleted` (reaching 90%).
 */
export function useLessonCompletion(lessonId, onBack, features = {}) {
  const {
    hasVideo = true,
    hasQuiz = true,
    hasChecklist = false,
    hasScenario = false,
    hasAction = false
  } = features;

  const { showToast } = useToast();
  const isInitialMount = useRef(true);
  const userId = getCurrentUserId();
  const storageKey = `lesson_progress_${userId}_${lessonId}`;

  const loadInitialState = (currentUserId, currentLessonId) => {
    const key = `lesson_progress_${currentUserId}_${currentLessonId}`;
    let state = {
      videoWatched: false,
      quizDone: false,
      checklistDone: false,
      scenarioAttempted: false,
      actionDone: false,
      celebrationShown: false
    };

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        state = { ...state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load lesson progress from localStorage', e);
    }

    return state;
  };

  const [completedSteps, setCompletedSteps] = useState(() => loadInitialState(userId, lessonId));

  // Fetch authoritative user activity completions from backend DB
  useEffect(() => {
    let isCancelled = false;
    async function syncBackendCompletion() {
      if (!userId || userId.startsWith('guest_') || userId === 'anonymous_user') return;
      try {
        const apiBase = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:5000'
          : '';
        const res = await fetch(`${apiBase}/api/activities/completions/${encodeURIComponent(userId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.completions) && !isCancelled) {
          const isDoneInDb = data.completions.some(c => c.lesson_id === lessonId);
          if (isDoneInDb) {
            setCompletedSteps(prev => ({
              ...prev,
              actionDone: true,
              celebrationShown: true
            }));
          } else {
            // Authoritative: DB confirms this user has NOT completed this lesson
            setCompletedSteps(prev => {
              if (prev.celebrationShown || prev.actionDone) {
                return {
                  ...prev,
                  actionDone: false,
                  celebrationShown: false
                };
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // Silent fallback to local state if backend is unreachable
      }
    }
    syncBackendCompletion();
    return () => { isCancelled = true; };
  }, [userId, lessonId]);

  // Re-sync completion steps state whenever userId or lessonId changes
  useEffect(() => {
    setCompletedSteps(loadInitialState(userId, lessonId));
  }, [userId, lessonId]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Only show toast if DB or user-scoped state confirms completion
      if (completedSteps.celebrationShown && !userId.startsWith('guest_')) {
        showToast("Welcome back! This activity has already been completed. You can review the lesson whenever you'd like.", "success", 4000);
      }
    }
  }, [completedSteps.celebrationShown, showToast, userId, lessonId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    } catch (e) {
      console.warn('Failed to save lesson progress to localStorage', e);
    }
  }, [completedSteps, storageKey]);

  const [lessonProgress, setLessonProgress] = useState(0);
  const [showCelebrate, setShowCelebrate] = useState(false);

  useEffect(() => {
    let totalSteps = 0;
    let completedCount = 0;

    if (hasVideo) {
      totalSteps += 1;
      if (completedSteps.videoWatched) completedCount += 1;
    }
    if (hasChecklist) {
      totalSteps += 1;
      if (completedSteps.checklistDone) completedCount += 1;
    }
    if (hasScenario) {
      totalSteps += 1;
      if (completedSteps.scenarioAttempted) completedCount += 1;
    }
    if (hasQuiz) {
      totalSteps += 1;
      if (completedSteps.quizDone) completedCount += 1;
    }
    if (hasAction) {
      totalSteps += 1;
      if (completedSteps.actionDone) completedCount += 1;
    }

    const percentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 100;
    setLessonProgress(percentage);
  }, [completedSteps, hasVideo, hasChecklist, hasScenario, hasQuiz, hasAction]);

  const handleVideoComplete = () => {
    setCompletedSteps((prev) => ({ ...prev, videoWatched: true }));
  };

  const handleQuizComplete = async () => {
    if (completedSteps.celebrationShown || completedSteps.quizDone) {
      showToast("You've already completed this activity.", "success", 3000);
      handleExit();
      return;
    }
    setCompletedSteps((prev) => ({ 
      ...prev, 
      quizDone: true,
      celebrationShown: true
    }));
    await completeLesson(lessonId);
    showToast("Quiz completed successfully!", "success", 2000);
    setTimeout(() => {
      handleExit();
    }, 1200);
  };

  const handleChecklistComplete = (isDone) => {
    setCompletedSteps((prev) => ({ ...prev, checklistDone: isDone }));
  };

  const handleScenarioComplete = () => {
    setCompletedSteps((prev) => ({ ...prev, scenarioAttempted: true }));
  };

  const handleActionComplete = async () => {
    if (completedSteps.actionDone || completedSteps.celebrationShown) {
      showToast("You've already completed this activity.", "success", 3000);
      handleExit();
      return;
    }
    setCompletedSteps((prev) => ({
      ...prev,
      actionDone: true,
      celebrationShown: true
    }));
    await completeLesson(lessonId);
    showToast("Activity marked as complete!", "success", 2000);
    setTimeout(() => {
      handleExit();
    }, 1200);
  };

  const handleCloseCelebration = async () => {
    setShowCelebrate(false);
    setCompletedSteps((prev) => ({
      ...prev,
      celebrationShown: true,
      actionDone: true
    }));
    await completeLesson(lessonId);
    if (onBack) {
      onBack();
    } else {
      goToDashboard();
    }
  };

  const isCompleted = 
    completedSteps.celebrationShown === true || 
    completedSteps.actionDone === true || 
    (hasQuiz && completedSteps.quizDone) || 
    (hasVideo && !hasQuiz && !hasAction && completedSteps.videoWatched) || 
    lessonProgress === 100;

  return {
    videoWatched: completedSteps.videoWatched,
    quizDone: completedSteps.quizDone,
    checklistDone: completedSteps.checklistDone,
    scenarioAttempted: completedSteps.scenarioAttempted,
    actionDone: completedSteps.actionDone,
    isCompleted,
    lessonProgress,
    showCelebrate,
    handleVideoComplete,
    handleQuizComplete,
    handleChecklistComplete,
    handleScenarioComplete,
    handleActionComplete,
    handleCloseCelebration
  };
}
