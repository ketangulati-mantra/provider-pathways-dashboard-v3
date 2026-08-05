/**
 * Service Context Management for Provider Pathways
 * Standardizes service identifiers across the platform.
 */

export const SUPPORTED_SERVICES = [
  'therapy',
  'listener',
  'yoga',
  'diet',
  'psychiatry',
  'physiotherapy',
  'dermatology',
  'coaching',
  'fitness',
  'women_wellness'
] as const;

export type ServiceType = string;

export const DEFAULT_SERVICE = 'therapy';

/**
 * Service name normalizer mapping legacy role names or case variations
 * to standard service identifiers.
 */
const SERVICE_ALIAS_MAP: Record<string, string> = {
  therapist: 'therapy',
  dietician: 'diet',
  psychiatrist: 'psychiatry',
  physiotherapist: 'physiotherapy',
  dermatologist: 'dermatology',
  coach: 'coaching',
  doctor: 'psychiatry',
  doctors: 'psychiatry',
  'women-wellness': 'women_wellness',
  women_health: 'women_wellness',
  'women-health': 'women_wellness'
};

/**
 * Normalizes an arbitrary service string to lower-case standard service name.
 */
export const normalizeService = (rawService?: string | null): string => {
  if (!rawService) return DEFAULT_SERVICE;
  const cleaned = rawService.trim().toLowerCase();
  if (SERVICE_ALIAS_MAP[cleaned]) {
    return SERVICE_ALIAS_MAP[cleaned];
  }
  return cleaned;
};

let cachedService: string | null = null;

/**
 * Reads the 'service' query parameter from URL ONCE during startup.
 * Returns normalized service identifier (e.g. 'therapy', 'listener', 'yoga').
 */
export const getCurrentService = (): string => {
  if (cachedService !== null) {
    return cachedService;
  }

  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    let serviceParam = params.get('service') || params.get('source');

    if (!serviceParam) {
      const match = window.location.pathname.match(/\/task\/market-yourself\/([a-zA-Z0-9_\-]+)/);
      if (match && match[1]) {
        serviceParam = match[1];
      }
    }

    cachedService = normalizeService(serviceParam);
  } else {
    cachedService = DEFAULT_SERVICE;
  }

  return cachedService;
};

/**
 * Resets cached service context (primarily useful for dev environment / testing).
 */
export const setServiceContext = (service: string): string => {
  cachedService = normalizeService(service);
  return cachedService;
};
