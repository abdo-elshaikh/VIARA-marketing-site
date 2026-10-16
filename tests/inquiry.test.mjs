import test from 'node:test';
import assert from 'node:assert/strict';
import { inquirySchema, scopeEstimateSchema, estimateArchive, branchBand, formatInquiryMessage } from '../lib/inquiry.ts';
import { healthcareSystems, normalizeCatalogSearch } from '../lib/healthcare-catalog.mjs';
const valid = {
  id: '6933fe22-93d5-405f-8e40-70b6b63f37db', name: '  مركز تجريبي  ',
  email: 'hello@example.com', phone: '+20 1012345678', organization: 'منشأة تجريبية',
  facility: 'مركز أشعة', branches: 'فرع واحد', interest: 'RIS', plan: 'أساس',
  message: 'طلب عرض توضيحي', consent: true, website: '',
};
test('healthcare scope accepts known systems and expanded facilities while rejecting unknown or excessive selections',()=>{
 const parsed=inquirySchema.parse({...valid,facility:'مستشفى',systems:['HIS','EHR','LIS']});
 assert.deepEqual(parsed.systems,['HIS','EHR','LIS']);
 for(const systems of [['NOT_REAL'],['LIS','LIS'],healthcareSystems.slice(0,7).map(s=>s.id)])assert.equal(inquirySchema.safeParse({...valid,systems}).success,false);
 const summary=formatInquiryMessage('Original notes',undefined,'en',parsed.systems);
 assert.ok(summary.startsWith('Original notes'));
 for(const name of ['Hospital management','Electronic health records','Laboratory management'])assert.ok(summary.includes(name));
 assert.ok(summary.includes('subject to assessment'));
 assert.equal(normalizeCatalogSearch('أَشِعَّة'),normalizeCatalogSearch('اشعة'));
});
test('valid requests are normalized, including Arabic phone digits', () => {
  const result = inquirySchema.parse({ ...valid, phone: '+٢٠ ١٠١٢٣٤٥٦٧٨' });
  assert.equal(result.name, 'مركز تجريبي');
  assert.equal(result.phone, '+20 1012345678');
});
test('invalid contact details, consent, identifiers, scopes and spam are rejected', () => {
  for (const invalid of [
    { email: 'no-email' }, { phone: '-------' }, { phone: 'call-me' }, { consent: false },
    { name: '   ' }, { id: '../other-user' }, { interest: 'INVALID' },
    { website: 'https://spam.test' }, { message: 'a'.repeat(2001) }, { organization: '' },
  ]) assert.equal(inquirySchema.safeParse({ ...valid, ...invalid }).success, false, JSON.stringify(invalid).slice(0,80));
});

const scope = { modalities: ['MR', 'CT'], dailyScans: 10, branches: 3, operatingDays: 200, averageMiB: 128, retentionYears: 2, backupCopies: 1 };
test('archive planning counts exact branches, working days, retention and additional copies', () => {
  assert.deepEqual(estimateArchive(scopeEstimateSchema.parse(scope)), { annualScans: 6000, annualGiB: 750, totalGiB: 3000 });
  assert.equal(estimateArchive({ ...scope, backupCopies: 0 }).totalGiB, 1500);
  assert.deepEqual([1, 2, 5, 6].map(branchBand), ['فرع واحد', '2–5 فروع', '2–5 فروع', 'أكثر من 5 فروع']);
});
test('invalid calculator inputs cannot be attached to an inquiry', () => {
  for (const invalid of [{branches:0},{branches:101},{branches:2.5},{operatingDays:367},{dailyScans:-1},{averageMiB:0},{retentionYears:21},{backupCopies:6},{modalities:[]},{modalities:['MR','MR']},{modalities:['OTHER']}]) {
    assert.equal(inquirySchema.safeParse({ ...valid, scope: { ...scope, ...invalid } }).success, false);
  }
});
test('request summaries retain notes and validated estimator context in both languages', () => {
  for (const locale of ['ar', 'en']) {
    const parsed = inquirySchema.parse({ ...valid, locale, message: 'a'.repeat(2000), scope: { ...scope, fabricatedTotal: 1 } });
    assert.equal('fabricatedTotal' in parsed.scope, false);
    const message = formatInquiryMessage(parsed.message, parsed.scope, parsed.locale);
    assert.ok(message.startsWith('a'.repeat(2000)));
    assert.ok(message.includes('6000'));
    assert.ok(message.includes('3000 GiB'));
    assert.ok(message.includes('MR'));
    assert.ok(message.length < 4000);
  }
  assert.equal(formatInquiryMessage('original notes', undefined, 'ar'), 'original notes');
});
