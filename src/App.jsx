import React, { useState, useEffect } from 'react';
import './App.css';
import { getCurrentService, getAvailableActivities, preserveQueryParams, handleExit } from './mantra';
import { resolveLessonView } from './views/viewResolver';
import DeveloperLessonsPage from './views/DeveloperLessonsPage';
import IntroductionLessonPage from './views/IntroductionLessonPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Dynamic base path support for root (Vercel/local) or subfolder (/provider_pathways) deployments
  const envBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

  const getPath = () => {
    if (typeof window !== 'undefined') {
      // Priority 0: Check URL query parameters for task/lesson/activity passed by phone apps
      const searchParams = new URLSearchParams(window.location.search);
      const paramTask = searchParams.get('task') || searchParams.get('lesson_id') || searchParams.get('lessonId') || searchParams.get('lesson') || searchParams.get('activity') || searchParams.get('activityId') || searchParams.get('route');
      if (paramTask) {
        const cleanTask = paramTask.startsWith('/') ? paramTask : `/task/${paramTask}`;
        return cleanTask.split('?')[0];
      }

      // Priority 1: Check window.location.hash for SPA client routes e.g. #/task/ocd-certificate, #/ocd-certificate, #ocd-certificate
      if (window.location.hash) {
        const rawHash = window.location.hash.replace(/^#\/?/, '');
        if (rawHash) {
          const pathOnly = rawHash.split('?')[0];
          const cleanPath = pathOnly.startsWith('task/') ? `/${pathOnly}` : (pathOnly.startsWith('/') ? pathOnly : `/task/${pathOnly}`);
          if (cleanPath.startsWith('/task/') || cleanPath.startsWith('/admin') || cleanPath.length > 1) {
            return cleanPath;
          }
        }
      }
    }

    let p = window.location.pathname;
    const base = envBase ? envBase.replace(/\/$/, '') : '';
    
    if (base && p.startsWith(base)) {
      p = p.slice(base.length) || '/';
    } else if (p.startsWith('/app/content/provider_pathways')) {
      p = p.slice('/app/content/provider_pathways'.length) || '/';
    } else if (p.startsWith('/provider_pathways_dashboard_v3')) {
      p = p.slice('/provider_pathways_dashboard_v3'.length) || '/';
    } else if (p.startsWith('/provider_pathways_dashboard_v2')) {
      p = p.slice('/provider_pathways_dashboard_v2'.length) || '/';
    } else if (p.startsWith('/provider_dashboard_v1')) {
      p = p.slice('/provider_dashboard_v1'.length) || '/';
    } else if (p.startsWith('/provider_pathways_dashboard_v1')) {
      p = p.slice('/provider_pathways_dashboard_v1'.length) || '/';
    } else if (p.startsWith('/provider_pathways_v2_testing')) {
      p = p.slice('/provider_pathways_v2_testing'.length) || '/';
    } else if (p.startsWith('/provider_pathways')) {
      p = p.slice('/provider_pathways'.length) || '/';
    } else if (p.startsWith('/provider_pathway')) {
      p = p.slice('/provider_pathway'.length) || '/';
    } else if (p.startsWith('/provider_activity')) {
      p = p.slice('/provider_activity'.length) || '/';
    }

    if (p && !p.startsWith('/task/') && !p.startsWith('/admin') && p !== '/' && p !== '/provider_activity') {
      return `/task${p.startsWith('/') ? p : '/' + p}`;
    }

    return p || '/';
  };

  const [currentPath, setCurrentPath] = useState(getPath());

  // Current service context extracted once at startup via URL parameter (e.g. ?service=therapy)
  const currentService = getCurrentService();

  // Clean up legacy 'source=' query parameter to standard 'service=' on startup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('source=')) {
      const params = new URLSearchParams(window.location.search);
      const sourceVal = params.get('source');
      if (sourceVal && !params.has('service')) {
        params.set('service', sourceVal);
      }
      params.delete('source');
      const cleanSearch = params.toString();
      const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '') + window.location.hash;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // Custom router state listener
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    const p = window.location.pathname;
    const subpathMatch = p.match(/^(\/[^\/]+)/);
    const currentSubpath = (subpathMatch && subpathMatch[1] && !subpathMatch[1].startsWith('/task')) ? subpathMatch[1] : '';
    const activeBase = envBase || currentSubpath;
    const fullPath = path === '/' ? (activeBase || '/') : ((activeBase + path).replace('//', '/'));
    const targetUrl = preserveQueryParams(fullPath);
    window.history.replaceState(null, '', targetUrl);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get activities filtered for the current service context
  const availableActivities = getAvailableActivities(currentService);

  // Render view based on route path and service context
  const renderView = () => {
    const onBackCallback = () => handleExit();

    // Default Root View (/ or /provider_activity): Admin Submissions Dashboard
    if (currentPath === '/' || currentPath === '/provider_activity' || currentPath === '/admin' || currentPath === '/dev' || currentPath === '/admin/dashboard') {
      return <DeveloperLessonsPage onNavigate={navigate} />;
    }

    // Use viewResolver to map route and service to appropriate lesson/activity component
    const resolvedView = resolveLessonView({
      currentPath,
      currentService,
      onBack: onBackCallback,
      activities: availableActivities
    });

    if (resolvedView) {
      return resolvedView;
    }

    // Default Fallback: Admin Submissions Dashboard
    return <DeveloperLessonsPage onNavigate={navigate} />;
  };

  return (
    <ErrorBoundary>
      <div className="App" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        {renderView()}
      </div>
    </ErrorBoundary>
  );
}

export default App;
