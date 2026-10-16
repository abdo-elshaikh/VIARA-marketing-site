import { z } from "zod";
import { healthcareSystems, formatSystemsSummary } from './healthcare-catalog.mjs';
export const requestedSystemsSchema = z.array(z.string().refine(id => healthcareSystems.some(system => system.id === id))).max(6).refine(ids => new Set(ids).size === ids.length);
export const scopeEstimateSchema = z.object({
  modalities: z.array(z.enum(['MR', 'CT', 'DX', 'US', 'MG'])).min(1).max(5)
    .refine(values => new Set(values).size === values.length),
  dailyScans: z.number().int().min(1).max(10000),
  branches: z.number().int().min(1).max(100),
  operatingDays: z.number().int().min(1).max(366),
  averageMiB: z.number().int().min(1).max(10000),
  retentionYears: z.number().int().min(1).max(20),
  backupCopies: z.number().int().min(0).max(5),
});
export type ScopeEstimate = z.infer<typeof scopeEstimateSchema>;
export function estimateArchive(scope: ScopeEstimate) {
  const annualScans = scope.dailyScans * scope.operatingDays * scope.branches;
  const annualGiB = annualScans * scope.averageMiB / 1024;
  return { annualScans, annualGiB, totalGiB: annualGiB * scope.retentionYears * (1 + scope.backupCopies) };
}
export function branchBand(count: number) {
  return count === 1 ? 'فرع واحد' : count <= 5 ? '2–5 فروع' : 'أكثر من 5 فروع';
}
export function formatScopeSummary(scope: ScopeEstimate, locale: string) {
  const { annualScans, totalGiB } = estimateArchive(scope);
  return locale === 'en'
    ? `Preliminary archive estimate\nModalities: ${scope.modalities.join(', ')}\nBranches: ${scope.branches}; exams/day/branch: ${scope.dailyScans}; operating days/year: ${scope.operatingDays}\nAverage study: ${scope.averageMiB} MiB; retention: ${scope.retentionYears} years; additional backup copies: ${scope.backupCopies}\nAnnual exams: ${annualScans}; estimated total: ${Math.ceil(totalGiB)} GiB\nExcludes growth, existing archives and storage overhead. Subject to technical review.`
    : `تقدير أولي للأرشفة\nالأجهزة: ${scope.modalities.join('، ')}\nالفروع: ${scope.branches}؛ فحوصات/يوم/فرع: ${scope.dailyScans}؛ أيام العمل/سنة: ${scope.operatingDays}\nمتوسط الدراسة: ${scope.averageMiB} MiB؛ الاحتفاظ: ${scope.retentionYears} سنوات؛ نسخ احتياطية إضافية: ${scope.backupCopies}\nالفحوصات السنوية: ${annualScans}؛ إجمالي السعة التقديرية: ${Math.ceil(totalGiB)} GiB\nلا يشمل النمو والأرشيف السابق ومساحة تشغيل التخزين. يخضع للمراجعة الفنية.`;
}
export function formatInquiryMessage(message: string, scope: ScopeEstimate | undefined, locale: string, systems: string[] = []) {
  return scope || systems.length ? [message.trim(), scope ? formatScopeSummary(scope, locale) : '', formatSystemsSummary(systems, locale)].filter(Boolean).join('\n\n') : message;
}
export const inquirySchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(25)
    .transform(value => value.replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776)))
    .refine(value => /^[+\d\s()-]+$/.test(value) && value.replace(/\D/g, "").length >= 7),
  organization: z.string().trim().min(2).max(150),
  facility: z.enum(["مركز أشعة", "مركز طبي", "عيادات تخصصية", "مجموعة فروع", "مستشفى", "مختبر تحاليل", "منشأة أخرى"]),
  branches: z.enum(["فرع واحد", "2–5 فروع", "أكثر من 5 فروع"]),
  interest: z.enum(["RIS", "PACS", "CMS", "SUITE", "CONSULT"]),
  plan: z.enum(["أساس", "نمو", "مؤسسات", "لم أحدد بعد"]),
  message: z.string().trim().max(2000).default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
  offer: z.string().trim().max(3000).default(""),
  scope: scopeEstimateSchema.optional(),
  systems: requestedSystemsSchema.optional(),
});
export const interestNames: Record<string, string> = {
  RIS: "إدارة مراكز الأشعة", PACS: "أرشفة الصور الطبية", CMS: "إدارة المراكز الطبية",
  SUITE: "الحل المتكامل", CONSULT: "استشارة لاختيار النظام",
};
