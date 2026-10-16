import ModernHome from '../care-home';
import { readPublicContent, readPublishedReviews } from '../../lib/site-server';
import { homeMetadata, jsonLd, organizationSchema } from '../../lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { content } = await readPublicContent();
  return homeMetadata(content, 'en');
}

export default async function EnglishHome() {
  const [{ content }, reviews] = await Promise.all([readPublicContent(), readPublishedReviews()]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema(content)) }}
      />
      <ModernHome content={content} reviews={reviews} locale="en" />
    </>
  );
}
