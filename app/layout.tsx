import type { Metadata } from "next";
import "./globals.css";
import './brand-theme.css';
import { headers } from "next/headers";

const metadataByLocale = {
  ar: {
    title: "VIARA | أنظمة مراكز الأشعة والمراكز الطبية",
    description: "استكشف حلول VIARA لإدارة مراكز الأشعة RIS، وأرشفة الصور الطبية PACS، وإدارة المراكز الطبية والعيادات CMS.",
  },
  en: {
    title: "VIARA | Radiology & Medical Center Systems",
    description: "Explore VIARA solutions for radiology workflow (RIS), medical image archiving (PACS), and medical center and clinic management (CMS).",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await headers()).get("x-viara-locale") === "en" ? "en" : "ar";
  const fallback = metadataByLocale[locale];
  return {
    title: fallback.title,
    description: fallback.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://viara.health"),
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      locale: locale === "en" ? "en_GB" : "ar_EG",
      type: "website",
      images: [{ url: "/assets/viara-social.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fallback.title,
      description: fallback.description,
      images: ["/assets/viara-social.png"],
    },
    icons: {
      icon: "/assets/viara-symbol-small.webp",
      shortcut: "/assets/viara-symbol-small.webp",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-viara-locale") === "en" ? "en" : "ar";
  return (
    <html lang={locale} dir={locale === "en" ? "ltr" : "rtl"} suppressHydrationWarning>
      <head><link rel="preload" href={locale === "en" ? "/fonts/manrope-variable.woff2" : "/fonts/tajawal-regular.woff2"} as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
