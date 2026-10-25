import CareHome from './care-home';
import { readPublicContent, readPublishedReviews } from '../lib/site-server';
import { homeMetadata, jsonLd, organizationSchema, websiteSchema, faqSchema } from '../lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { content } = await readPublicContent();
  return homeMetadata(content, 'ar');
}

export default async function Home() {
  const [{ content }, reviews] = await Promise.all([readPublicContent(), readPublishedReviews()]);
  const faq = faqSchema(content, 'ar');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [organizationSchema(content), websiteSchema(content, 'ar'), ...(faq ? [faq] : [])] }) }}
      />
      <CareHome content={content} reviews={reviews} locale="ar" />
    </>
  );
}
