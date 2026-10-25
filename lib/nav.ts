import type { Locale } from './site-content';

export type NavItem = { id: string; href: string; label: string };

/** Single source of truth for the public navigation links (Arabic-first labels). */
export function getNavLinks(locale: Locale, options: { includeCapabilities?: boolean } = {}): NavItem[] {
  const en = locale === 'en';
  const prefix = en ? '/en' : '';
  const home = en ? '/en' : '/';
  const t = (ar: string, english: string) => (en ? english : ar);
  const links: NavItem[] = [
    { id: 'home', href: home, label: t('الرئيسية', 'Home') },
    { id: 'systems', href: `${prefix}/systems`, label: t('الأنظمة', 'Systems') },
  ];
  links.push(
    { id: 'journeys', href: `${prefix}/journeys`, label: t('سير العمل', 'Workflows') },
    { id: 'planning', href: `${prefix}/planning`, label: t('الخطط', 'Planning') },
    { id: 'about', href: `${prefix}/about`, label: t('عن فيارا', 'About VIARA') },
  );
  return links;
}
