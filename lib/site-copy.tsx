'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { Locale, SiteContent } from './site-content';

const CopyContext = createContext<SiteContent['copy']>({});
export function SiteCopyProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <CopyContext.Provider value={content.copy}>{children}</CopyContext.Provider>;
}
export function useSiteText(locale: Locale, content?: SiteContent) {
  const inherited = useContext(CopyContext);
  const copy = content?.copy || inherited;
  return (ar: string, en: string) => copy[en]?.[locale] || (locale === 'en' ? en : ar);
}
