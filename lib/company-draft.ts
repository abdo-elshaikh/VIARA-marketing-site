const fields = {
  principles: ['title', 'body'],
  offices: ['name', 'address', 'hours', 'phone', 'email', 'mapUrl'],
  support: ['label', 'description', 'hours', 'phone', 'email', 'url'],
  team: ['name', 'role', 'bio', 'image'],
  milestones: ['period', 'title', 'body'],
  credentials: ['title', 'body', 'url'],
} as const;
export type CompanyGroup = keyof typeof fields;
const bilingual = new Set(['title', 'body', 'name', 'address', 'hours', 'label', 'description', 'role', 'bio']);

/** Blank, unpublished entries also work when a group has no template rows. */
export function createCompanyDraft(group: CompanyGroup, id: string) {
  return {
    ...Object.fromEntries(fields[group].map(field => [field, bilingual.has(field) ? { ar: '', en: '' } : ''])),
    id,
    enabled: false,
  };
}
