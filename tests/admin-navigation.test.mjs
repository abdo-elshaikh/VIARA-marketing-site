import test from 'node:test';
import assert from 'node:assert/strict';
import { adminTabs, adminSections, resolveAdminDestination, parseAdminHash, adminHash, searchAdminDestinations, adminFieldDestination } from '../lib/admin-navigation.ts';
import { loginErrorMessage } from '../lib/admin-login.ts';
import { preparePublicContent } from '../lib/public-content.ts';
import { defaultContent, siteContentSchema } from '../lib/site-content.ts';
import { homeMetadata, organizationSchema } from '../lib/seo.ts';
import { enabledHeroVisuals, heroVisuals } from '../lib/home-hero-visuals.ts';
import { readAdminDraft } from '../lib/admin-draft.ts';
import { publishContentSchema, secureLinkSchema, secureImageSchema, settingsSchemas } from '../lib/publish-content.ts';
import { isSecureUrl } from '../lib/site-url.ts';
import { createPreviewContent } from '../lib/preview-content.ts';
import { createCompanyDraft } from '../lib/company-draft.ts';
import { companySchema, initialCompany } from '../lib/company-content.ts';

test('admin destinations round-trip and every section belongs to a known tab', () => {
  assert.equal(new Set(adminSections.map(item => item.id)).size, adminSections.length);
  for (const section of adminSections) {
    assert.ok(adminTabs.some(tab => tab.id === section.tab));
    const destination = { tab: section.tab, section: section.id };
    assert.deepEqual(parseAdminHash(adminHash(destination)), destination);
    assert.deepEqual(parseAdminHash(`#${section.id}`), destination);
  }
});

test('admin deep links reject unknown destinations and cross-tab section IDs', () => {
  assert.deepEqual(parseAdminHash('#<script>/arbitrary'), { tab: 'overview', section: '' });
  assert.deepEqual(parseAdminHash(''), { tab: 'overview', section: '' });
  assert.equal(resolveAdminDestination('settings', 'cms-company-team').section, 'cms-section-brand');
  assert.equal(parseAdminHash('#products').section, 'cms-section-systems');
});

test('settings search matches bilingual aliases, Arabic diacritics and precise subsections', () => {
  assert.equal(searchAdminDestinations('واتساب')[0].section, 'cms-section-contact');
  assert.equal(searchAdminDestinations('settings logo')[0].section, 'cms-section-brand');
  assert.equal(searchAdminDestinations('الأَلْوَان')[0].section, 'cms-section-brand');
  assert.equal(searchAdminDestinations('الباقات')[0].section, 'cms-section-plans');
  assert.equal(searchAdminDestinations('seo')[0].section, 'cms-section-seo');
  assert.equal(searchAdminDestinations('unmatched-value-12345').length, 0);
});

test('empty company groups can create schema-valid bilingual unpublished drafts', () => {
  for (const group of ['principles', 'offices', 'support', 'team', 'milestones', 'credentials']) {
    const company = structuredClone(initialCompany);
    company[group] = [createCompanyDraft(group, `new-${group}`)];
    assert.equal(companySchema.safeParse(company).success, true, group);
    assert.equal(company[group][0].enabled, false);
    if ('title' in company[group][0]) assert.deepEqual(company[group][0].title, { ar: '', en: '' });
  }
  const first = createCompanyDraft('offices', 'a');
  const second = createCompanyDraft('offices', 'b');
  first.name.ar = 'Changed';
  assert.equal(second.name.ar, '');
});

test('validation points to the editor containing the invalid field', () => {
  assert.equal(adminFieldDestination(['contact', 'email']).section, 'cms-section-contact');
  assert.equal(adminFieldDestination(['company', 'team', 0, 'name']).section, 'cms-company-team');
  assert.equal(adminFieldDestination(['company', 'storyBody', 'ar']).section, 'cms-company-profile');
  assert.equal(adminFieldDestination(['products', 0, 'features']).section, 'cms-section-systems');
  assert.equal(adminFieldDestination(['seo', 'description']).section, 'cms-section-seo');
});

test('published settings and company edits survive public preparation without resurrecting disabled groups', () => {
  const draft = structuredClone(defaultContent);
  draft.company.legalName = { ar: 'شركة مخصصة', en: 'Custom company' };
  draft.company.storyTitle = { ar: 'قصتنا', en: 'Our story' };
  draft.company.storyBody = { ar: 'تعريف مخصص', en: 'Custom introduction' };
  for (const group of ['principles', 'team', 'offices', 'support', 'milestones', 'credentials']) draft.company[group] = [];
  draft.brand.name = 'Custom';
  draft.brand.primary = '#123456';
  draft.contact.telegram = 'https://t.me/example';
  draft.imagery = { hero: '/assets/share.webp', care: '/assets/company.webp' };
  const published = preparePublicContent(siteContentSchema.parse(draft));
  assert.deepEqual(published.company, draft.company);
  assert.deepEqual(published.brand, draft.brand);
  assert.deepEqual(published.contact, draft.contact);
  assert.deepEqual(published.imagery, draft.imagery);
  const metadata = homeMetadata(published, 'en');
  assert.equal(metadata.openGraph.images[0].url, draft.imagery.hero);
  assert.equal(metadata.twitter.images[0], draft.imagery.hero);
  assert.ok(organizationSchema(published).sameAs.includes(draft.contact.telegram));
});

test('configured system images override illustrations and clearing them restores the default', () => {
  assert.equal(enabledHeroVisuals([{ id: 'RIS', enabled: true, image: '/assets/custom.webp' }])[0].image, '/assets/custom.webp');
  assert.equal(enabledHeroVisuals([{ id: 'RIS', enabled: true, image: '' }])[0].image, heroVisuals.find(item => item.id === 'RIS').image);
});

test('login failures provide localized actionable messages without exposing server details', () => {
  for (const status of [401, 403, 429, 503, 500, 502]) {
    assert.match(loginErrorMessage(status, false), /[\u0600-\u06ff]/);
    assert.match(loginErrorMessage(status, true), /[A-Za-z]/);
    assert.notEqual(loginErrorMessage(status, false), loginErrorMessage(status, true));
  }
  assert.match(loginErrorMessage(429, true), /Wait/);
  assert.match(loginErrorMessage(503, true), /operator/);
});

test('public preparation preserves explicitly authored copy including exclusions and customized portal text', () => {
  const draft = structuredClone(defaultContent);
  const text = { ar: 'هذا العرض لا يشمل المستشفيات', en: 'This offer excludes hospitals' };
  draft.seo.description = text;
  draft.hero.description = text;
  draft.about.body = text;
  draft.copy['Custom text'] = text;
  draft.company.eyebrow = text;
  draft.faqs = [{ id: 'scope', question: text, answer: text }];
  const portal = draft.products.find(product => product.id === 'PORTAL');
  portal.name = { ar: 'بوابتي', en: 'My portal' };
  portal.features = [text];
  portal.description = text;
  const published = preparePublicContent(siteContentSchema.parse(draft));
  assert.deepEqual(published.seo, draft.seo);
  assert.deepEqual(published.hero, draft.hero);
  assert.deepEqual(published.about, draft.about);
  assert.deepEqual(published.copy, draft.copy);
  assert.deepEqual(published.faqs, draft.faqs);
  assert.deepEqual(published.company, draft.company);
  assert.deepEqual(published.products.find(product => product.id === 'PORTAL'), portal);
});

test('public preparation keeps supported catalog boundaries while retaining the saved draft', () => {
  const draft = structuredClone(defaultContent);
  draft.products.push({ ...draft.products[0], id: 'UNSUPPORTED', enabled: true });
  const published = preparePublicContent(draft);
  assert.equal(published.products.find(product => product.id === 'UNSUPPORTED').enabled, false);
  assert.equal(draft.products.find(product => product.id === 'UNSUPPORTED').enabled, true);
});

test('draft recovery accepts complete snapshots and rejects malformed or invalid records', () => {
  const snapshot = { content: structuredClone(defaultContent), baseVersion: 4, savedAt: Date.now(), demo: false };
  assert.deepEqual(readAdminDraft(JSON.stringify(snapshot)), snapshot);
  for (const raw of [null, '', '{broken', 'null', 'x'.repeat(2_000_001)]) assert.equal(readAdminDraft(raw), null);
  for (const patch of [{ baseVersion: -1 }, { baseVersion: 1.2 }, { savedAt: 0 }, { savedAt: 1e20 }, { demo: 'true' }, { content: {} }]) {
    assert.equal(readAdminDraft(JSON.stringify({ ...snapshot, ...patch })), null);
  }
});

test('new publications reject incomplete or unsafe links without blocking legacy records from opening', () => {
  const draft = structuredClone(defaultContent);
  draft.contact.facebook = 'https://';
  draft.imagery.hero = 'https://';
  draft.company.offices = [{ ...createCompanyDraft('offices', 'office'), mapUrl: 'https://' }];
  assert.equal(siteContentSchema.safeParse(draft).success, true);
  assert.equal(settingsSchemas.contact.safeParse(draft.contact).success, false);
  assert.equal(settingsSchemas.imagery.safeParse(draft.imagery).success, false);
  const result = publishContentSchema.safeParse(draft);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')).sort(), ['company.offices.0.mapUrl', 'contact.facebook', 'imagery.hero']);
  assert.equal(publishContentSchema.safeParse(defaultContent).success, true);
});

test('settings URL validation accepts complete secure destinations and local assets', () => {
  for (const value of ['https://example.com', 'https://example.com/path?q=1#section', 'https://مثال.مصر/صورة']) assert.equal(isSecureUrl(value), true, value);
  for (const value of ['', 'https://', 'https://user:secret@example.com', 'http://example.com', 'javascript:alert(1)', '//example.com', 'https://exa\nmple.com']) assert.equal(isSecureUrl(value), false, value);
  assert.equal(secureLinkSchema.safeParse('').success, true);
  for (const value of ['/assets/logo.webp', '/api/media/abc.png', 'https://example.com/image.webp']) assert.equal(secureImageSchema.safeParse(value).success, true);
  for (const value of ['', '/assets/../secret', 'data:image/png;base64,abc', 'https://']) assert.equal(secureImageSchema.safeParse(value).success, false);
});

test('local preview content preserves configured identity and contacts without inventing credentials or people', () => {
  const current = structuredClone(defaultContent);
  current.brand.name = 'Configured brand';
  current.contact.email = 'contact@example.com';
  current.contact.phone = '+12025550100';
  current.contact.address = { ar: 'العنوان المسجل', en: 'Configured address' };
  const original = structuredClone(current);
  const preview = createPreviewContent(current);
  assert.equal(publishContentSchema.safeParse(preview).success, true);
  assert.deepEqual(current, original);
  assert.deepEqual(preview.brand, current.brand);
  assert.deepEqual(preview.contact, current.contact);
  assert.deepEqual(preview.products.filter(item => item.enabled).map(item => item.id).sort(), ['AI', 'CMS', 'PACS', 'PORTAL', 'RIS']);
  assert.deepEqual(preview.company.credentials, []);
  assert.equal(preview.company.support[0].email, current.contact.email);
  assert.equal(preview.company.offices[0].email, current.contact.email);
  assert.ok(preview.company.team.every(item => item.name.en.includes('preview example')));
  assert.ok(preview.company.milestones.every(item => item.period.includes('PREVIEW')));
  assert.ok(preview.offers.every(item => item.title.en.includes('preview only')));
  assert.equal(createPreviewContent(defaultContent).company.offices.length, 0);
});
