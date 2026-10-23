'use client';
import React from 'react';
import { CustomerData } from '@/types/booking';
import { User, Phone, Mail, FileText, ShieldCheck } from 'lucide-react';

interface CustomerFormProps {
  customer: CustomerData;
  onChange: (field: keyof CustomerData, value: string) => void;
}

export function CustomerForm({ customer, onChange }: CustomerFormProps) {
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Vos coordonnées
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Nous vous enverrons un SMS et un email de confirmation de votre rendez-vous.
        </p>
      </div>

      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}>
          {/* Prénom */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}>
              Prénom *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
              <input
                type="text"
                required
                placeholder="Ex: Sophie"
                value={customer.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  fontSize: '14px',
                  background: 'var(--bg-main)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>
          </div>

          {/* Nom */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}>
              Nom *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
              <input
                type="text"
                required
                placeholder="Ex: Dupont"
                value={customer.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  fontSize: '14px',
                  background: 'var(--bg-main)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}>
              Téléphone portable (Rappel SMS) *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
              <input
                type="tel"
                required
                placeholder="Ex: 06 12 34 56 78"
                value={customer.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  fontSize: '14px',
                  background: 'var(--bg-main)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px',
            }}>
              Email (Confirmation) *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
              <input
                type="email"
                required
                placeholder="Ex: sophie.dupont@email.com"
                value={customer.email}
                onChange={(e) => onChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  fontSize: '14px',
                  background: 'var(--bg-main)',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Remarques / Particularités */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '6px',
          }}>
            Remarques / Souhaits particuliers (Optionnel)
          </label>
          <div style={{ position: 'relative' }}>
            <FileText size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
            <textarea
              rows={3}
              placeholder="Ex: Cheveux très épais, cuir chevelu sensible, souhait d'éclaircissement très naturel..."
              value={customer.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border)',
                fontSize: '14px',
                background: 'var(--bg-main)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}>
          <ShieldCheck size={16} style={{ color: '#16a34a' }} />
          <span>Vos données restent confidentielles et ne sont transmises qu’à l’équipe du salon.</span>
        </div>
      </div>
    </div>
  );
}
