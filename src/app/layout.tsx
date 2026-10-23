import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'MiamPOS Booking • Rendez-vous Salon & Beauté',
  description: 'Espace de prise de rendez-vous en ligne certifié MiamPOS pour salons de coiffure et instituts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="antialiased min-h-screen bg-[#f9fafb] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
