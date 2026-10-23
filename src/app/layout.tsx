import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MiamPOS Booking • Réservation en ligne Coiffure & Beauté',
  description: 'Prenez rendez-vous en ligne simplement et rapidement dans vos salons de coiffure et instituts de beauté partenaires.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
