import { MANTRA_CONFIG } from './config';
import { getLesson } from './api';

/**
 * Centrally preserves all active URL query parameters (service, upa_id, uid, locale, etc.)
 * when navigating to a new path or route.
 */
export const preserveQueryParams = (targetPath: string): string => {
  if (typeof window === 'undefined' || !window.location) {
    return targetPath;
  }

  const [pathname, targetQuery] = targetPath.split('?');
  const currentParams = new URLSearchParams(window.location.search || '');

  // Normalize legacy 'source' param to 'service'
  if (currentParams.has('source')) {
    const val = currentParams.get('source');
    if (val && !currentParams.has('service')) {
      currentParams.set('service', val);
    }
    currentParams.delete('source');
  }

  if (targetQuery) {
    const targetParams = new URLSearchParams(targetQuery);
    targetParams.forEach((value, key) => {
      if (key === 'source') {
        currentParams.set('service', value);
      } else {
        currentParams.set(key, value);
      }
    });
  }

  const mergedSearch = currentParams.toString();
  return mergedSearch ? `${pathname}?${mergedSearch}` : pathname;
};

/**
 * Handles exit actions by navigating back to the Dashboard (/).
 */
export const handleExit = () => {
  goToLesson('/');
};

/**
 * Handles back routing, navigating back to Dashboard (/).
 */
export const goBack = (onBackCallback?: () => void) => {
  if (onBackCallback) {
    onBackCallback();
  } else {
    goToDashboard();
  }
};

/**
 * Redirects back to the Dashboard (/).
 */
export const goToDashboard = () => {
  goToLesson('/');
};

/**
 * Navigates popstate router to the selected task route pathway,
 * automatically preserving query parameters.
 */
export const goToLesson = (route: string) => {
  if (typeof window === 'undefined') return;

  const currentPathname = window.location.pathname;
  const subpathMatch = currentPathname.match(/^(\/[^\/]+)/);
  const currentSubpath = (subpathMatch && subpathMatch[1] && !subpathMatch[1].startsWith('/task')) ? subpathMatch[1] : '';

  const fullPath = route === '/' ? (currentSubpath || '/') : ((currentSubpath + route).replace('//', '/'));
  const targetUrl = preserveQueryParams(fullPath);

  window.history.replaceState(null, '', targetUrl);
  window.dispatchEvent(new Event('popstate'));
};


