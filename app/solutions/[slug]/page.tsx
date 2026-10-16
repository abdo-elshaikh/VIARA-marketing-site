import SolutionPage, { solutionMetadata } from '../../solution-page';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return solutionMetadata((await params).slug, 'ar'); }
export default async function Page({ params }: Props) { return <SolutionPage slug={(await params).slug} locale="ar" />; }
