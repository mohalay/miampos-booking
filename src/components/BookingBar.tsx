'use client';
import React from 'react';
import { SelectedServiceItem } from '@/types/booking';
import { ArrowRight, Clock } from 'lucide-react';

interface BookingBarProps {
  selectedItems: SelectedServiceItem[];
  onOpenBooking: () => void;
}

export function BookingBar({ selectedItems, onOpenBooking }: BookingBarProps) {
  if (selectedItems.length === 0) return null;

  const count = selectedItems.length;
  const totalPrice = selectedItems.reduce((acc, it) => acc + it.service.price, 0);
  const totalMinutes = selectedItems.reduce((acc, it) => acc + it.service.durationMinutes, 0);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-2xl bg-gray-900/95 backdrop-blur-xl text-white rounded-full p-2.5 pl-5 pr-2.5 shadow-2xl flex items-center justify-between gap-4 z-40 border border-white/10 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-400 leading-none">
            {count} prestation{count > 1 ? 's' : ''} • {totalMinutes} min
          </span>
          <span className="text-base font-extrabold tracking-tight mt-0.5">
            {totalPrice.toFixed(2)} €
          </span>
        </div>
      </div>

      <button
        onClick={onOpenBooking}
        className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-100 transition active:scale-95 shrink-0 shadow-sm"
      >
        <span>Choisir mon créneau</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
