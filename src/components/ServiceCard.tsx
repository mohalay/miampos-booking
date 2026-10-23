'use client';
import React from 'react';
import { ServiceItem } from '@/types/booking';
import { Clock, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: ServiceItem;
  isSelected: boolean;
  onToggle: (service: ServiceItem) => void;
}

export function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3",
      isSelected 
        ? "border-black shadow-md ring-1 ring-black" 
        : "border-black/[0.06] hover:border-black/20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
    )}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight leading-snug">
            {service.name}
          </h3>
          <span className="font-bold text-sm sm:text-base text-gray-900 shrink-0">
            {service.price.toFixed(2)} €
          </span>
        </div>

        {service.description && (
          <p className="text-xs sm:text-[13px] text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
            {service.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          <Clock size={12} className="text-gray-400" />
          <span>{service.durationMinutes} min</span>
        </span>

        <button
          onClick={() => onToggle(service)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer",
            isSelected
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-100 hover:bg-black hover:text-white text-gray-800"
          )}
        >
          {isSelected ? (
            <>
              <Check size={13} />
              <span>Ajouté</span>
            </>
          ) : (
            <>
              <Plus size={13} />
              <span>Choisir</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
