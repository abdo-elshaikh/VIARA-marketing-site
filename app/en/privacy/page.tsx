import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Privacy Policy | VIARA',
  robots: { index: false, follow: false },
};
export default function PrivacyPageEn() {
  return (
    <main dir="ltr" lang="en" style={{maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'system-ui, sans-serif', lineHeight: 1.8, color: '#1e293b'}}>
      <h1 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem'}}>Privacy Policy</h1>
      <p style={{color: '#64748b', marginBottom: '2rem'}}>Last updated: October 2026</p>

      <h2>What data do we collect?</h2>
      <p>When you submit a contact form we collect: your name, facility name, email address, phone number, and any facility details or request information you optionally provide.</p>

      <h2>How do we use your data?</h2>
      <p>Contact details are used solely to review and respond to your request. We do not share your data with third parties for marketing purposes.</p>

      <h2>Request history</h2>
      <p>Your request history is linked to a guest identifier stored in this browser (cookie). Requests may not appear on other devices or after clearing site data.</p>

      <h2>Important note</h2>
      <p>Do not include patient information or sensitive medical data in contact forms.</p>

      <h2>Contact us</h2>
      <p>For any queries about your data, reach us at the email address listed on the contact page.</p>

      <p style={{marginTop: '2rem'}}><Link href="/en" style={{color: '#007b61'}}>← Back to home</Link></p>
    </main>
  );
}
