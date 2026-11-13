import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createPreviewContent } from '../lib/preview-content.ts';
import { publishContentSchema } from '../lib/publish-content.ts';
import { inquirySchema } from '../lib/inquiry.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const store = fileURLToPath(new URL('./local-preview-store.py', import.meta.url));
function localStore(mode, input) {
  const result = spawnSync('python', [store, mode], { cwd: root, env: { ...process.env, PYTHONUTF8: '1' }, input: input ? JSON.stringify(input) : undefined, encoding: 'utf8', maxBuffer: 8_000_000 });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || 'Local seed failed');
  return JSON.parse(result.stdout);
}

const snapshot = localStore('snapshot');
const content = publishContentSchema.parse(createPreviewContent(snapshot.content));
for (const asset of [content.brand.logo, ...Object.values(content.imagery)]) {
  if (asset.startsWith('/assets/') && !existsSync(fileURLToPath(new URL('../public' + asset, import.meta.url)))) throw new Error('Missing preview asset: ' + asset);
}
const systems = ['RIS', 'PACS', 'CMS', 'PORTAL', 'AI'];
const statuses = ['new', 'contacted', 'proposal', 'won', 'closed'];
const inquiries = systems.map((interest, index) => ({
  ...inquirySchema.parse({
    id: randomUUID(),
    name: `طلب معاينة ${index + 1} — بيانات تجريبية`,
    email: `preview-${index + 1}@example.invalid`,
    phone: `+1202555010${index}`,
    organization: index % 2 ? 'عيادات المعاينة — مثال غير حقيقي' : 'مركز أشعة للمعاينة — مثال غير حقيقي',
    facility: index % 2 ? 'مركز طبي' : 'مركز أشعة',
    branches: 'فرع واحد', interest, plan: 'لم أحدد بعد',
    message: 'سجل محلي تجريبي لمعاينة الطلبات والبحث وحالات المتابعة. ليس طلب عميل فعليًا، ولا تُرسل إليه رسائل.',
    consent: true, locale: index % 2 ? 'en' : 'ar',
  }), status: statuses[index],
}));
const result = localStore('apply', { content, previous: snapshot.content, version: snapshot.version, inquiries });
console.log(JSON.stringify({ ...result, systems: systems, newTestimonials: 0 }, null, 2));
