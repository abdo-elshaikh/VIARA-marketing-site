import { cookies } from 'next/headers';
import { readPublicContent } from '../../../lib/site-server';
import { readMyRequests } from '../../../lib/my-requests';
import RequestsView from '../../requests/requests-view';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Requests | VIARA', robots: { index: false, follow: false } };

export default async function RequestsPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('viara_uid')?.value;
  const { content } = await readPublicContent();
  let records: Awaited<ReturnType<typeof readMyRequests>> = [];
  let error = false;
  if (clientId) {
    try {
      records = await readMyRequests(clientId);
    } catch {
      error = true;
    }
  }
  return <RequestsView records={records} loadError={error} content={content} locale="en" />;
}
