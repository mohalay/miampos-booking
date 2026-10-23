import { Suspense } from 'react';
import { SalonBookingClient } from './SalonBookingClient';

export default async function SalonBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        fontSize: '14px',
        color: 'var(--text-muted)',
      }}>
        Chargement du salon...
      </div>
    }>
      <SalonBookingClient slug={slug} />
    </Suspense>
  );
}
