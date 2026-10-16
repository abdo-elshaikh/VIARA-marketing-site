import SolutionPage, { solutionMetadata } from '../../../solution-page';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return solutionMetadata((await params).slug, 'en'); }
export default async function Page({ params }: Props) { return <SolutionPage slug={(await params).slug} locale="en" />; }
