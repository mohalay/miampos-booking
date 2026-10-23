'use client';
import React from 'react';
import { StaffMember } from '@/types/booking';
import { UserCheck, Sparkles, Check, Heart } from 'lucide-react';

interface StaffSelectorProps {
  staffList: StaffMember[];
  selectedStaff: StaffMember | null;
  onSelectStaff: (staff: StaffMember) => void;
}

export function StaffSelector({
  staffList,
  selectedStaff,
  onSelectStaff,
}: StaffSelectorProps) {
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Choisissez votre praticien
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Sélectionnez votre coiffeur préféré ou laissez-nous choisir le créneau le plus rapide pour vous.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {staffList.map((member) => {
          const isSelected = selectedStaff?.id === member.id;
          const isAny = member.id === 'staff-any';

          return (
            <div
              key={member.id}
              onClick={() => onSelectStaff(member)}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                boxShadow: isSelected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  {/* Avatar / Monogram */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: member.color || 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isAny ? '20px' : '18px',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-md)',
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    flexShrink: 0,
                  }}>
                    {member.initials || member.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {member.name}
                      </h3>
                      {isSelected && (
                        <span style={{
                          color: 'var(--primary)',
                          display: 'inline-flex',
                        }}>
                          <Check size={18} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Specialties Tags */}
                {member.specialties && member.specialties.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {member.specialties.map((spec, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-pill)',
                          background: isSelected ? 'var(--primary-light)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Status */}
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {isSelected ? (
                  <>
                    <Check size={15} />
                    <span>Praticien sélectionné</span>
                  </>
                ) : (
                  <span>Choisir ce praticien</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
