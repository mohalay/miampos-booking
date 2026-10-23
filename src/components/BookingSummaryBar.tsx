'use client';
import React from 'react';
import { SelectedServiceItem, StaffMember } from '@/types/booking';
import { Clock, ArrowRight, Check } from 'lucide-react';
import { BookingStep } from './BookingProgress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingSummaryBarProps {
  currentStep: BookingStep;
  items: SelectedServiceItem[];
  staff: StaffMember | null;
  selectedDate: Date;
  selectedSlot: string;
  isSubmitting?: boolean;
  onNext: () => void;
}

export function BookingSummaryBar({
  currentStep,
  items,
  staff,
  selectedDate,
  selectedSlot,
  isSubmitting = false,
  onNext,
}: BookingSummaryBarProps) {
  if (items.length === 0) return null;

  const totalPrice = items.reduce((sum, item) => {
    const optsPrice = item.selectedOptions.reduce((s, o) => s + o.price, 0);
    return sum + item.service.price + optsPrice;
  }, 0);

  const totalDuration = items.reduce((sum, item) => {
    const optsDur = item.selectedOptions.reduce((s, o) => s + (o.durationMinutes || 0), 0);
    return sum + item.service.durationMinutes + optsDur;
  }, 0);

  let buttonText = 'Continuer';
  if (currentStep === 'services') buttonText = 'Choisir le praticien';
  else if (currentStep === 'staff') buttonText = 'Choisir la date & heure';
  else if (currentStep === 'datetime') buttonText = 'Saisir mes coordonnées';
  else if (currentStep === 'details') buttonText = 'Confirmer mon rendez-vous';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)',
      maxWidth: '820px',
      background: 'rgba(24, 24, 27, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-xl)',
      padding: '16px 24px',
      boxShadow: 'var(--shadow-luxury)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      zIndex: 100,
      color: '#ffffff',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Left: Summary info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
            {items.length} prestation{items.length > 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {totalPrice.toFixed(2)} €
          </div>
        </div>

        <div style={{ height: '32px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e4e4e7', fontWeight: 600 }}>
          <Clock size={15} style={{ color: 'var(--primary)' }} />
          <span>{totalDuration} min</span>
        </div>

        {selectedSlot && (
          <div style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: 600 }}>
            📅 {format(selectedDate, 'd MMM', { locale: fr })} à {selectedSlot}
          </div>
        )}
      </div>

      {/* Right: Action CTA */}
      <button
        onClick={onNext}
        disabled={isSubmitting}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '14px',
          fontWeight: 800,
          color: '#ffffff',
          background: 'var(--primary)',
          boxShadow: 'var(--shadow-primary)',
          cursor: isSubmitting ? 'wait' : 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
        }}
      >
        <span>{isSubmitting ? 'Confirmation...' : buttonText}</span>
        {currentStep === 'details' ? <Check size={17} /> : <ArrowRight size={17} />}
      </button>
    </div>
  );
}
