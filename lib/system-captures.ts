import type { Locale, Localized } from './site-content';
type CaptureFiles = { image: string; thumbnail?: string; original?: string; width: number; height: number };
export type SystemCapture = { id: string; title: Localized; description: Localized; image: string; thumbnail?: string; original?: string; width: number; height: number; state?: Localized; capturedAt?: string; localized?: Partial<Record<Locale, CaptureFiles>> };
const L = (ar: string, en: string): Localized => ({ ar, en });
const live = (name: string) => ({ image: `/assets/system/captures-20261019/${name}.png`, thumbnail: `/assets/system/captures-20261019/${name}-small.webp`, original: `/assets/system/captures-20261019/${name}.png`, width: 1680, height: 1050, capturedAt: '2026-10-19' });
const currentLive = (name: string, width: number, height: number) => ({ image: `/assets/system/captures-20261106/${name}.png`, original: `/assets/system/captures-20261106/${name}.png`, width, height, capturedAt: '2026-11-06' });
const liveShowcase = (name: string) => ({ image: `/assets/system/captures-20261106/${name}.png`, original: `/assets/system/captures-20261106/${name}.png`, width: 1292, height: 974, capturedAt: '2026-11-06' });
const files = (name: string, locale: Locale): CaptureFiles => ({ image: `/assets/system/captures-20261027/${name}-${locale}.webp`, thumbnail: `/assets/system/captures-20261027/${name}-${locale}-small.webp`, original: `/assets/system/captures-20261027/${name}-${locale}.webp`, width: 1600, height: 1000 });
const fresh = (name: string) => ({ ...files(name, 'en'), capturedAt: '2026-10-27', localized: { ar: files(name, 'ar'), en: files(name, 'en') } });
export const systemCaptures: Record<string, SystemCapture[]> = {
  RIS: [
    { id: 'clinical-workspace-live', title: L('قائمة العمل السريري الحية', 'Live clinical worklist'), description: L('لقطة حية من مساحة العمل السريرية التجريبية، تعرض مراحل سير العمل والفلاتر دون فتح سجلات مرضى.', 'A live capture from the demo clinical workspace showing workflow stages and filters without opening patient records.'), ...currentLive('live-workspace-clinical-desktop', 1536, 2250) },
    { id: 'worklist', title: L('قائمة العمل وجدولة الفحوصات', 'Worklist and examination scheduling'), description: L('لقطة فعلية لقائمة العمل ومراحل الفحص والفلاتر في النظام المحلي، مع قوائم خالية من بيانات المرضى.', 'An actual capture of the local worklist, examination stages and filters, with no patient records displayed.'), ...live('ris-worklist') },
    { id: 'modality', title: L('قائمة عمل غرف الفحص', 'Modality queue'), description: L('شاشة متابعة الفحوصات حسب المرحلة والأولوية والمهام المتاحة، ملتقطة من النسخة المحلية.', 'The examination queue with stage, priority and task filters, captured from the local application.'), ...live('ris-modality') },
  ],
  CMS: [
    { id: 'reception-workspace-live', title: L('مساحة الاستقبال الحية', 'Live reception workspace'), description: L('لقطة حية من مساحة استقبال تجريبية تعرض مؤشرات السجلات والبحث والفلاتر دون عرض ملف مريض.', 'A live capture from the demo reception workspace showing record metrics, search and filters without displaying a patient file.'), ...currentLive('live-workspace-reception-desktop', 1536, 1686) },
    { id: 'appointments', title: L('جدولة المواعيد ومتابعة الإشغال', 'Appointment scheduling workspace'), description: L('لقطة فعلية لشاشة المواعيد، تتضمن فلاتر الغرف والفحوصات وخيارات العرض اليومي والأسبوعي والشهري.', 'An actual capture of appointment scheduling with room and examination filters and day, week and month views.'), ...live('cms-appointments') },
    { id: 'reception', title: L('الاستقبال والعمليات اليومية', 'Reception and daily operations'), description: L('لقطة محفوظة من مساحة عمل الاستقبال مع أقسام الجدولة ودليل المرضى والتحصيل والفواتير.', 'A saved capture of the reception workspace with scheduling, patient directory, cashier and billing sections.'), image: '/assets/system/viara-system-reception-cms-web.webp', original: '/assets/system/viara-system-reception-cms.png', width: 1800, height: 1125 },
  ],
  PACS: [
    { id: 'diagnostic-workstation-live', title: L('محطة العمل التشخيصية — لقطة عرض حية', 'Diagnostic workstation — live showcase capture'), description: L('لقطة حية من مشهد العرض العام لمحطة العمل التشخيصية في النظام الفعلي. لا تمثل جلسة عارض داخلية موثقة ولا تعرض بيانات مرضى.', 'A live capture from the public diagnostic workstation showcase in the actual system. It is not an authenticated internal viewer session and contains no patient data.'), ...liveShowcase('live-scene-reporting-desktop') },
    {
      id: 'viewer',
      title: L('عارض الفحوصات التشخيصي DICOM', 'Diagnostic DICOM viewer'),
      description: L('محطة المعاينة التشخيصية لصور الرنين المغناطيسي والأشعة المقطعية المتوافقة مع معيار DICOM 3.0 وخيارات إعادة البناء 3D / MPR.', 'Diagnostic reading station for MRI, CT and multi-planar reconstruction compliant with DICOM 3.0 standard.'),
      image: '/assets/system/viara-system-pacs-viewer-web.webp',
      thumbnail: '/assets/system/captures-20261019/pacs-reconciliation-small.webp',
      original: '/assets/system/captures-20261019/pacs-viewer.png',
      width: 1800,
      height: 1125,
      capturedAt: '2026-10-19',
    },
    { id: 'matching', title: L('مطابقة دراسات PACS مع الفحوصات', 'PACS study matching'), description: L('لقطة فعلية لشاشة مراجعة الدراسات الواردة وفلاتر المطابقة وأسباب المراجعة، دون عرض بيانات مرضى.', 'An actual capture of incoming study review, matching filters and review reasons, with no patient data displayed.'), ...live('pacs-reconciliation') },
  ],
  AI: [], // No reviewed capture of the AI workflow is available yet.
  PORTAL: [
    { id: 'hub', title: L('الواجهة العامة لبوابة المركز', 'Center portal homepage'), description: L('لقطة فعلية للبوابة: الخدمات وروابط الحجز والوصول إلى النتائج، دون سجلات مرضى.', 'An actual portal homepage capture showing services, booking entry points and result access, with no patient records.'), ...fresh('portal-hub') },
    { id: 'doctor', title: L('دخول الأطباء المحيلين', 'Referring physician sign-in'), description: L('واجهة الدخول الفعلية للأطباء المحيلين؛ لا تعرض ملف مريض أو نتائج بعد الدخول.', 'The actual referring physician sign-in screen; this capture does not show an authenticated patient record or results.'), ...fresh('portal-doctor') },
    { id: 'patient', title: L('دخول المريض إلى البوابة', 'Patient portal sign-in'), description: L('واجهة الدخول بالرقم الطبي وكلمة المرور. الحقول فارغة ولا تتضمن بيانات مرضى.', 'Sign-in with a medical record number and password. The fields are empty and contain no credentials or patient data.'), ...fresh('portal-patient') },
    { id: 'verify', title: L('التحقق من اعتماد التقرير', 'Report approval lookup'), description: L('واجهة إدخال مرجع التقرير للاستعلام عن اعتماده. لم يُدخل مرجع حقيقي أثناء الالتقاط.', 'The report-reference entry screen for approval lookup. No real report reference was submitted during capture.'), ...fresh('portal-verify') },
  ],
};

export function getSystemCaptures(systemId: string, locale: Locale): SystemCapture[] {
  return (systemCaptures[systemId] || []).map(capture => ({ ...capture, ...capture.localized?.[locale] }));
}
