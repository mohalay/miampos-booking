'use client';
import React, { useState } from 'react';
import { SalonInfo } from '@/types/booking';
import { MapPin, Phone, Clock, ChevronDown, X } from 'lucide-react';
import { parseWeeklySchedule, DAY_KEYS, DAY_LABELS } from '@/lib/openingHours';

interface NavbarProps {
  salon: SalonInfo;
}

export function Navbar({ salon }: NavbarProps) {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const schedule = parseWeeklySchedule(salon.weeklyScheduleJson);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Logo & Info */}
          <div className="flex items-center gap-3 min-w-0">
            {salon.logoUrl ? (
              <img
                src={salon.logoUrl}
                alt={salon.name}
                className="w-9 h-9 object-contain rounded-xl bg-gray-50 border border-black/[0.06] p-1 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {salon.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base tracking-tight truncate leading-tight text-gray-900">
                {salon.name}
              </span>
              {salon.address && (
                <span className="text-[11px] font-normal truncate mt-0.5 flex items-center gap-1 text-gray-500">
                  <MapPin size={11} className="shrink-0 opacity-70" />
                  <span className="truncate">{salon.address}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: Hours status & Phone */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHoursModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.05] text-xs transition cursor-pointer active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-bold text-gray-900 text-[11px] sm:text-xs">Ouvert</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {salon.phone && (
              <a
                href={`tel:${salon.phone}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition active:scale-95"
              >
                <Phone size={12} />
                <span>{salon.phone}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Opening Hours Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <Clock size={16} />
                <span>Horaires d’ouverture</span>
              </div>
              <button
                onClick={() => setShowHoursModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              {DAY_KEYS.map((day) => {
                const conf = schedule[day];
                const isOpen = conf?.isOpen;
                return (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="font-semibold text-gray-700">{DAY_LABELS[day]}</span>
                    <span className={isOpen ? "text-gray-900 font-medium" : "text-gray-400 font-normal"}>
                      {isOpen && conf.ranges.length > 0
                        ? conf.ranges.map(r => `${r.start} - ${r.end}`).join(' / ')
                        : 'Fermé'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowHoursModal(false)}
              className="w-full mt-2 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
