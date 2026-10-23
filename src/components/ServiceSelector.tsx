'use client';
import React, { useState } from 'react';
import { ServiceCategory, ServiceItem, ServiceOption, SelectedServiceItem } from '@/types/booking';
import { Clock, Plus, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ServiceSelectorProps {
  categories: ServiceCategory[];
  selectedItems: SelectedServiceItem[];
  onToggleService: (service: ServiceItem) => void;
  onToggleOption: (serviceId: string, option: ServiceOption) => void;
}

export function ServiceSelector({
  categories,
  selectedItems,
  onToggleService,
  onToggleOption,
}: ServiceSelectorProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || ''
  );
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  const isServiceSelected = (serviceId: string) => {
    return selectedItems.some((item) => item.service.id === serviceId);
  };

  const isOptionSelected = (serviceId: string, optionId: string) => {
    const found = selectedItems.find((item) => item.service.id === serviceId);
    if (!found) return false;
    return found.selectedOptions.some((opt) => opt.id === optionId);
  };

  return (
    <div className="animate-fade">
      {/* Category Pills Slider */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '24px',
        scrollbarWidth: 'none',
      }}>
        {categories.map((cat) => {
          const isCatActive = cat.id === activeCategoryId;
          const selectedInCat = selectedItems.filter(
            (item) => item.service.categoryId === cat.id
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '14px',
                fontWeight: isCatActive ? 700 : 500,
                color: isCatActive ? '#ffffff' : 'var(--text-main)',
                background: isCatActive ? 'var(--text-main)' : 'var(--surface)',
                border: `1px solid ${isCatActive ? 'var(--text-main)' : 'var(--border)'}`,
                boxShadow: isCatActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{cat.name}</span>
              {selectedInCat > 0 && (
                <span style={{
                  background: isCatActive ? 'var(--primary)' : 'var(--primary-light)',
                  color: isCatActive ? '#ffffff' : 'var(--primary)',
                  fontSize: '11px',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {selectedInCat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Header */}
      {activeCategory && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {activeCategory.name}
          </h2>
          {activeCategory.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              {activeCategory.description}
            </p>
          )}
        </div>
      )}

      {/* Services List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activeCategory?.services.map((service) => {
          const selected = isServiceSelected(service.id);
          const hasOptions = service.options && service.options.length > 0;
          const isExpanded = expandedServiceId === service.id;

          return (
            <div
              key={service.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                boxShadow: selected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                padding: '20px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                {/* Title & Info */}
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {service.name}
                    </h3>
                  </div>

                  {service.description && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.45 }}>
                      {service.description}
                    </p>
                  )}

                  {/* Badges: Duration & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-subtle)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                    }}>
                      <Clock size={13} style={{ color: 'var(--primary)' }} />
                      {service.durationMinutes} min
                    </span>

                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      letterSpacing: '-0.02em',
                    }}>
                      {service.price.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {hasOptions && selected && (
                    <button
                      onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <Sparkles size={13} style={{ color: 'var(--primary)' }} />
                      <span>Options de soin</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}

                  <button
                    onClick={() => onToggleService(service)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: selected ? '#ffffff' : 'var(--text-main)',
                      background: selected ? 'var(--primary)' : 'var(--surface)',
                      border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: selected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {selected ? (
                      <>
                        <Check size={16} />
                        <span>Sélectionné</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Service Options (collapsible or when selected) */}
              {hasOptions && selected && isExpanded && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px dashed var(--border)',
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    Personnalisez votre moment :
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {service.options?.map((opt) => {
                      const optSelected = isOptionSelected(service.id, opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => onToggleOption(service.id, opt)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${optSelected ? 'var(--primary)' : 'var(--border)'}`,
                            background: optSelected ? 'var(--primary-light)' : 'var(--surface)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                              {opt.name}
                            </div>
                            {opt.durationMinutes ? (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                +{opt.durationMinutes} min
                              </div>
                            ) : null}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: optSelected ? 'var(--primary)' : 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}>
                            +{opt.price.toFixed(2)} €
                            {optSelected && <Check size={14} style={{ color: 'var(--primary)' }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
