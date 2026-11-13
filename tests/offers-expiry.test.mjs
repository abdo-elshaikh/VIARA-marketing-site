import test from 'node:test';
import assert from 'node:assert/strict';
import { isOfferActive, cairoDay, offerSchema } from '../lib/site-content.ts';

test('offers expiry logic: valid active future offer', () => {
  const offer = offerSchema.parse({
    id: 'f1a4e219-b695-4dc2-8f92-5b9e0787a111',
    title: { ar: 'خصم 20%', en: '20% OFF' },
    description: { ar: 'تفاصيل العرض', en: 'Offer details' },
    badge: { ar: 'انطلاق', en: 'Launch' },
    endDate: '2026-12-26',
    active: true,
    plan: 'نمو',
    image: '/assets/offers/offer-launch-20.jpg',
  });

  const now = new Date('2026-10-26T12:00:00Z');
  assert.equal(isOfferActive(offer, now), true);
});

test('offers expiry logic: expired offer is automatically excluded', () => {
  const expiredOffer = offerSchema.parse({
    id: 'e3b0c442-98fc-4c14-9a8d-123456789abc',
    title: { ar: 'عرض منتهي', en: 'Expired Offer' },
    description: { ar: 'انتهت صلاحية هذا العرض', en: 'This offer has expired' },
    badge: { ar: 'منتهي', en: 'Expired' },
    endDate: '2026-10-24', // 2 days before 2026-10-26
    active: true,
    plan: 'أساس',
    image: '/assets/offers/offer-earlybird-25.jpg',
  });

  const now = new Date('2026-10-26T12:00:00Z');
  assert.equal(isOfferActive(expiredOffer, now), false);

  const offers = [expiredOffer];
  const activeOffers = offers.filter(o => isOfferActive(o, now));
  assert.equal(activeOffers.length, 0, 'Expired offers must not appear in activeOffers');
});

test('offers expiry logic: 2-day offer is active today and expires after 2 days', () => {
  const twoDayOffer = offerSchema.parse({
    id: '7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e',
    title: { ar: 'عرض 48 ساعة', en: '48-Hour Deal' },
    description: { ar: 'عرض محدود', en: 'Limited Deal' },
    badge: { ar: 'ينتهي خلال يومين', en: 'Ends in 2 days' },
    endDate: '2026-10-28',
    active: true,
    plan: 'أساس',
    image: '/assets/offers/offer-earlybird-25.jpg',
  });

  // Current day: 2026-10-26 -> Active!
  const now = new Date('2026-10-26T20:00:00Z');
  assert.equal(isOfferActive(twoDayOffer, now), true);

  // Tomorrow: 2026-10-27 -> Active!
  const tomorrow = new Date('2026-10-27T12:00:00Z');
  assert.equal(isOfferActive(twoDayOffer, tomorrow), true);

  // The final day: 2026-10-28 Cairo evening (21:00 Cairo time is 18:00 UTC) -> Active!
  const lastDay = new Date('2026-10-28T18:00:00Z');
  assert.equal(isOfferActive(twoDayOffer, lastDay), true);

  // After 2 days: 2026-10-29 (e.g. 2026-10-28T22:00:00Z which is 01:00 Cairo time on Oct 29) -> Expired!
  const afterExpiry = new Date('2026-10-28T22:00:00Z');
  assert.equal(isOfferActive(twoDayOffer, afterExpiry), false);
});
