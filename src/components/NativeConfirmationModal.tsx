'use client';
import React from 'react';
import { AppointmentConfirmation } from '@/types/booking';
import { CheckCircle2, Calendar, Clock, MapPin, User, Sparkles, X, Download, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NativeConfirmationModalProps {
  confirmation: AppointmentConfirmation | null;
  onClose: () => void;
}

export function NativeConfirmationModal({ confirmation, onClose }: NativeConfirmationModalProps) {
  if (!confirmation) return null;

  // Generate downloadable .ics calendar file
  const handleDownloadIcs = () => {
    const startDateTime = new Date(`${confirmation.date}T${confirmation.timeSlot}:00`);
    const endDateTime = new Date(startDateTime.getTime() + confirmation.totalDurationMinutes * 60000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatIcsDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const summary = `RDV Coiffure & Soins - ${confirmation.salonName}`;
    const description = `Prestations : ${confirmation.items.map(i => i.service.name).join(', ')}\\nPraticien : ${confirmation.staffMember.name}\\nRef : ${confirmation.bookingId}`;
    const location = confirmation.salonAddress || confirmation.salonName;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MiamPOS Booking//FR',
      'BEGIN:VEVENT',
      `UID:rdv-${confirmation.bookingId}@miampos.fr`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDateTime)}`,
      `DTEND:${formatIcsDate(endDateTime)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `rdv-${confirmation.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(24, 24, 27, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 9999,
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '540px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-luxury)',
        border: '1px solid var(--border)',
        padding: '32px 28px',
        position: 'relative',
        animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Close cross */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Top Celebration Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-primary)',
          }}>
            <CheckCircle2 size={38} />
          </div>

          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}>
            Rendez-vous confirmé !
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Merci {confirmation.customer.firstName}, votre réservation a bien été enregistrée auprès de l’équipe de{' '}
            <strong style={{ color: 'var(--text-main)' }}>{confirmation.salonName}</strong>.
          </p>
        </div>

        {/* Booking Card details */}
        <div style={{
          background: 'var(--bg-main)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '20px',
          marginBottom: '24px',
        }}>
          {/* Reference */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '14px',
            marginBottom: '14px',
            borderBottom: '1px dashed var(--border)',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Numéro de réservation
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: 800,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
            }}>
              #{confirmation.bookingId.slice(0, 8).toUpperCase()}
            </span>
          </div>

          {/* Date, Time, Stylist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <Calendar size={17} style={{ color: 'var(--primary)' }} />
              <span>
                <strong>{format(parseISO(confirmation.date), 'EEEE d MMMM yyyy', { locale: fr })}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <Clock size={17} style={{ color: 'var(--primary)' }} />
              <span>
                À <strong>{confirmation.timeSlot}</strong> (durée : {confirmation.totalDurationMinutes} min)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <User size={17} style={{ color: 'var(--primary)' }} />
              <span>
                Praticien : <strong>{confirmation.staffMember.name}</strong> ({confirmation.staffMember.role})
              </span>
            </div>

            {confirmation.salonAddress && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px' }}>
                <MapPin size={17} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <span>{confirmation.salonAddress}</span>
              </div>
            )}
          </div>

          {/* Services list */}
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Détail des prestations :
            </div>
            {confirmation.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>{item.service.name}</span>
                <strong>{item.service.price.toFixed(2)} €</strong>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: 800,
              paddingTop: '8px',
              borderTop: '1px dashed var(--border)',
              marginTop: '8px',
            }}>
              <span>Total à régler sur place</span>
              <span style={{ color: 'var(--primary)' }}>{confirmation.totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleDownloadIcs}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 20px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ffffff',
              background: 'var(--primary)',
              boxShadow: 'var(--shadow-primary)',
              cursor: 'pointer',
            }}
          >
            <Download size={17} />
            <span>Ajouter à mon agenda (Apple / Google / Outlook)</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-main)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            Prendre un autre rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
}
