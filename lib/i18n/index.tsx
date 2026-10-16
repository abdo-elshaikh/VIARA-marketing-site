import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ar } from './locales/ar';
import { en } from './locales/en';
import type { Locale } from '../site-content';

export type { Locale };

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export const dictionaries = {
  ar,
  en,
};

type DeepNestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${DeepNestedKeys<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = DeepNestedKeys<typeof ar>;

/**
 * Access a nested string value by dot-separated path
 */
function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Flexible translator function type supporting:
 * 1. t('common.nav.home')
 * 2. t('common.nav.home', { count: 23 })
 * 3. t('نص عربي', 'English text')
 */
export type TranslatorFn = {
  (key: TranslationKey | string, params?: Record<string, string | number>): string;
  (arabicFallback: string, englishFallback: string): string;
};

/**
 * Create a scoped translator function: t(key, paramsOrEnglish)
 */
export function createTranslator(locale: Locale = defaultLocale): TranslatorFn {
  return function t(
    keyOrAr: string,
    paramsOrEn?: Record<string, string | number> | string
  ): string {
    // Overload 2: t('نص عربي', 'English text')
    if (typeof paramsOrEn === 'string') {
      return locale === 'en' ? paramsOrEn : keyOrAr;
    }

    const dict = dictionaries[locale] || dictionaries[defaultLocale];
    let text = getNestedValue(dict, keyOrAr);

    // Fallback to default locale (Arabic) or English if not found
    if (text === undefined) {
      text =
        getNestedValue(dictionaries[defaultLocale], keyOrAr) ||
        getNestedValue(dictionaries.en, keyOrAr);
    }

    if (text === undefined) {
      return keyOrAr;
    }

    // Parameter interpolation: {param}
    if (paramsOrEn && typeof paramsOrEn === 'object') {
      for (const [k, v] of Object.entries(paramsOrEn)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }

    return text;
  } as TranslatorFn;
}

export function isRtl(locale: Locale): boolean {
  return locale === 'ar';
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}

/**
 * Switch URL path between Arabic ('/') and English ('/en')
 */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const clean = currentPath.split('#')[0].split('?')[0];
  const hash = currentPath.includes('#') ? `#${currentPath.split('#')[1]}` : '';
  const search = currentPath.includes('?') ? `?${currentPath.split('?')[1].split('#')[0]}` : '';

  let newPath = clean;
  if (targetLocale === 'en') {
    if (!clean.startsWith('/en')) {
      newPath = clean === '/' ? '/en' : `/en${clean}`;
    }
  } else {
    if (clean.startsWith('/en')) {
      newPath = clean.replace(/^\/en/, '') || '/';
    }
  }

  return `${newPath}${search}${hash}`;
}

/* =====================================================================
   REACT CONTEXT & HOOK FOR SEAMLESS CLIENT-SIDE I18N
   ===================================================================== */
export interface I18nContextValue {
  locale: Locale;
  t: TranslatorFn;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale = defaultLocale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      t: createTranslator(locale),
      isRtl: isRtl(locale),
      dir: getDirection(locale),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: defaultLocale,
      t: createTranslator(defaultLocale),
      isRtl: isRtl(defaultLocale),
      dir: getDirection(defaultLocale),
    };
  }
  return ctx;
}
