'use client';
import React from 'react';
import { Scissors, User, Calendar, CheckCircle2 } from 'lucide-react';

export type BookingStep = 'services' | 'staff' | 'datetime' | 'details';

interface BookingProgressProps {
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
  canNavigateTo: (step: BookingStep) => boolean;
}

export function BookingProgress({ currentStep, onStepClick, canNavigateTo }: BookingProgressProps) {
  const steps: { key: BookingStep; label: string; icon: React.ReactNode }[] = [
    { key: 'services', label: '1. Prestations', icon: <Scissors size={15} /> },
    { key: 'staff', label: '2. Praticien', icon: <User size={15} /> },
    { key: 'datetime', label: '3. Date & Heure', icon: <Calendar size={15} /> },
    { key: 'details', label: '4. Vos Coordonnées', icon: <CheckCircle2 size={15} /> },
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      marginBottom: '32px',
      background: 'var(--surface)',
      padding: '8px 12px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      overflowX: 'auto',
    }}>
      {steps.map((s, idx) => {
        const isActive = currentStep === s.key;
        const isClickable = canNavigateTo(s.key);

        return (
          <button
            key={s.key}
            onClick={() => isClickable && onStepClick(s.key)}
            disabled={!isClickable}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 600,
              color: isActive ? '#ffffff' : isClickable ? 'var(--text-main)' : 'var(--text-light)',
              background: isActive ? 'var(--primary)' : isClickable ? 'transparent' : 'transparent',
              boxShadow: isActive ? 'var(--shadow-primary)' : 'none',
              cursor: isClickable ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              flex: '1 1 auto',
              justifyContent: 'center',
            }}
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
