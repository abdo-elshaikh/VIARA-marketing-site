import { NextResponse } from 'next/server';
import { sameOrigin } from '../../../lib/admin-auth';
import { readLimitedJson, RequestBodyError } from '../../../lib/request-body';

const events = new Set([
  'view_solution', 'start_inquiry', 'submit_inquiry_success', 'submit_inquiry_failure',
  'use_archive_estimator', 'download_request_receipt', 'contact_channel_click',
]);

/** Accepts anonymous conversion events and optionally forwards them to an approved collector. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  let body: unknown;
  try { body = await readLimitedJson(request, 4000); }
  catch (error) { return NextResponse.json({ error: error instanceof RequestBodyError ? 'Invalid event' : 'Invalid request' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  const event = (body as { event?: unknown }).event;
  if (typeof event !== 'string' || !events.has(event)) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  const collector = process.env.ANALYTICS_WEBHOOK_URL;
  if (collector) {
    void fetch(collector, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VIARA-Event': 'marketing_event' },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  }
  return NextResponse.json({ accepted: true }, { status: 202 });
}
