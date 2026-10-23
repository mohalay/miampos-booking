'use client';
import React, { useState } from 'react';
import { WeeklySchedule, generateAvailableSlots, DAY_SHORT_LABELS, getDayKeyFromDate } from '@/lib/openingHours';
import { Calendar as CalendarIcon, Clock, Sun, Moon, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarSelectorProps {
  schedule: WeeklySchedule;
  totalDurationMinutes: number;
  selectedDate: Date;
  selectedSlot: string;
  onSelectDate: (date: Date) => void;
  onSelectSlot: (slot: string) => void;
}

export function CalendarSelector({
  schedule,
  totalDurationMinutes,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: CalendarSelectorProps) {
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Generate 14 selectable days starting from today + offset
  const today = new Date();
  const startDate = addDays(today, weekOffset * 7);
  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Compute available slots for currently selected date
  const availableSlots = generateAvailableSlots(
    selectedDate,
    schedule,
    totalDurationMinutes
  );

  // Group slots into Morning (< 13:00) and Afternoon (>= 13:00)
  const morningSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.split(':')[0], 10);
    return hour < 13;
  });

  const afternoonSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.split(':')[0], 10);
    return hour >= 13;
  });

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Choisissez la date et l’heure
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Durée totale estimée de vos soins : <strong style={{ color: 'var(--text-main)' }}>{totalDurationMinutes} min</strong>
        </p>
      </div>

      {/* Date Carousel Header */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700 }}>
            <CalendarIcon size={18} style={{ color: 'var(--primary)' }} />
            <span>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: weekOffset === 0 ? 'var(--text-light)' : 'var(--text-main)',
                cursor: weekOffset === 0 ? 'not-allowed' : 'pointer',
              }}
              title="Semaine précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
              title="Semaine suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          overflowX: 'auto',
        }}>
          {nextDays.map((d, i) => {
            const isSelected = isSameDay(d, selectedDate);
            const dayKey = getDayKeyFromDate(d);
            const isOpen = schedule[dayKey]?.isOpen;

            return (
              <button
                key={i}
                onClick={() => {
                  if (isOpen) {
                    onSelectDate(d);
                  }
                }}
                disabled={!isOpen}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected
                    ? 'var(--primary)'
                    : isOpen
                    ? 'var(--surface)'
                    : 'var(--bg-subtle)',
                  color: isSelected
                    ? '#ffffff'
                    : isOpen
                    ? 'var(--text-main)'
                    : 'var(--text-light)',
                  border: `1.5px solid ${
                    isSelected ? 'var(--primary)' : 'var(--border)'
                  }`,
                  boxShadow: isSelected ? 'var(--shadow-primary)' : 'none',
                  cursor: isOpen ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease',
                  opacity: isOpen ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {format(d, 'EEE', { locale: fr })}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>
                  {format(d, 'd')}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700 }}>
                  {isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Section */}
      {availableSlots.length === 0 ? (
        <div style={{
          background: 'var(--surface)',
          padding: '36px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
          textAlign: 'center',
        }}>
          <AlertCircle size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Aucun créneau disponible pour ce jour
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto' }}>
            Le salon est fermé ou tous les créneaux pour cette durée ({totalDurationMinutes} min) sont déjà réservés. Veuillez choisir une autre date ci-dessus.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Matin */}
          {morningSlots.length > 0 && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '16px',
              }}>
                <Sun size={17} style={{ color: 'var(--accent-gold)' }} />
                <span>Matinée</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ({morningSlots.length} créneaux)
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '10px',
              }}>
                {morningSlots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => onSelectSlot(slot)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isSlotSelected ? '#ffffff' : 'var(--text-main)',
                        background: isSlotSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                        border: `1.5px solid ${isSlotSelected ? 'var(--primary)' : 'var(--border)'}`,
                        boxShadow: isSlotSelected ? 'var(--shadow-primary)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Après-midi */}
          {afternoonSlots.length > 0 && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '16px',
              }}>
                <Moon size={17} style={{ color: '#8b5cf6' }} />
                <span>Après-midi</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ({afternoonSlots.length} créneaux)
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '10px',
              }}>
                {afternoonSlots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => onSelectSlot(slot)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isSlotSelected ? '#ffffff' : 'var(--text-main)',
                        background: isSlotSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                        border: `1.5px solid ${isSlotSelected ? 'var(--primary)' : 'var(--border)'}`,
                        boxShadow: isSlotSelected ? 'var(--shadow-primary)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
