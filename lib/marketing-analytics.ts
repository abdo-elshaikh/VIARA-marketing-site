'use client';

type MarketingEvent =
  | 'view_solution'
  | 'start_inquiry'
  | 'submit_inquiry_success'
  | 'submit_inquiry_failure'
  | 'use_archive_estimator'
  | 'download_request_receipt'
  | 'contact_channel_click';

const ALLOWED_EVENTS = new Set<MarketingEvent>([
  'view_solution',
  'start_inquiry',
  'submit_inquiry_success',
  'submit_inquiry_failure',
  'use_archive_estimator',
  'download_request_receipt',
  'contact_channel_click',
]);

/** Sends anonymous conversion signals only when a first-party endpoint is configured. */
export function trackMarketingEvent(event: MarketingEvent, metadata: Record<string, string> = {}) {
  if (!ALLOWED_EVENTS.has(event) || typeof window === 'undefined') return;
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics';
  if (!endpoint) return;
  const safeMetadata = Object.fromEntries(Object.entries(metadata).filter(([key, value]) =>
    ['locale', 'product', 'channel', 'page', 'source'].includes(key) && value.length <= 100
  ));
  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, metadata: safeMetadata, path: location.pathname, at: Date.now() }),
    keepalive: true,
  }).catch(() => undefined);
}
