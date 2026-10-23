import Link from 'next/link';
import { Scissors, Sparkles, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #ffffff 0%, #f6f4ee 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Navbar */}
      <nav style={{
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-primary)',
          }}>
            <Scissors size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            MiamPOS <span style={{ color: 'var(--primary)' }}>Booking</span>
          </span>
        </div>

        <Link
          href="/atelier-coiffure"
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '13px',
            fontWeight: 700,
            background: 'var(--surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Démo Salon
        </Link>
      </nav>

      {/* Hero Section */}
      <main style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '40px 20px 80px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <Sparkles size={14} />
          Plateforme Dédiée Coiffure & Instituts de Beauté
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 900,
          color: 'var(--text-main)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          Réservez votre moment d’exception en quelques clics.
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '640px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6,
        }}>
          Choisissez vos prestations, sélectionnez votre coiffeur préféré et validez votre créneau instantanément avec synchronisation directe en caisse.
        </p>

        {/* Quick Launch CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            href="/atelier-coiffure"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '15px',
              fontWeight: 800,
              color: '#ffffff',
              background: 'var(--primary)',
              boxShadow: 'var(--shadow-primary)',
              transition: 'transform 0.2s ease',
            }}
          >
            <span>Découvrir l’espace de réservation</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '60px',
          textAlign: 'left',
        }}>
          <div style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Calendar size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Créneaux Temps Réel
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Disponibilités calculées selon la durée exacte de chaque prestation et forfait.
            </p>
          </div>

          <div style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Clock size={24} style={{ color: 'var(--accent-gold)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Choix du Styliste
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Option "Sans préférence" pour aller vite ou sélection de votre coiffeur habituel.
            </p>
          </div>

          <div style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <ShieldCheck size={24} style={{ color: '#16a34a', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Ajout Calendrier & Rappels
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Fichier .ics compatible Apple Calendar, Google Calendar et Outlook en 1 clic.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
      }}>
        MiamPOS Booking System • Conçu pour les professionnels de la coiffure et de la beauté.
      </footer>
    </div>
  );
}
