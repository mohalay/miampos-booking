'use client';
import React from 'react';
import { SalonInfo } from '@/types/booking';
import { MapPin, Phone, Sparkles } from 'lucide-react';

interface HeaderProps {
  salon: SalonInfo;
}

export function Header({ salon }: HeaderProps) {
  return (
    <header style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-subtle) 100%)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
      marginBottom: '28px',
    }}>
      {/* Decorative luxury gradient blur */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '36px 20px 28px 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Salon Info Flex */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Logo or monogram avatar */}
          <div style={{
            width: '92px',
            height: '92px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            boxShadow: 'var(--shadow-luxury)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {salon.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={salon.logoUrl}
                alt={salon.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{salon.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
              }}>
                <Sparkles size={13} />
                Réservation en ligne certifiée
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#15803d',
                background: '#dcfce7',
                padding: '3px 9px',
                borderRadius: 'var(--radius-pill)',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Ouvert
              </span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}>
              {salon.name}
            </h1>

            {salon.description && (
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                maxWidth: '680px',
                marginBottom: '12px',
              }}>
                {salon.description}
              </p>
            )}

            {/* Address & Phone */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              {salon.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{salon.address}</span>
                </div>
              )}

              {salon.phone && (
                <a
                  href={`tel:${salon.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                  }}
                >
                  <Phone size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{salon.phone}</span>
                </a>
              )}

              {salon.instagramUrl && (
                <a
                  href={salon.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#c13584',
                    fontWeight: 600,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
