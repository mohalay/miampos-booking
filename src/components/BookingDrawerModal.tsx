'use client';
import React, { useState } from 'react';
import {
  SelectedServiceItem,
  StaffMember,
  CustomerData,
  AppointmentConfirmation,
  SalonInfo,
} from '@/types/booking';
import { X, Check, Calendar as CalendarIcon, Clock, User, ArrowRight, Download, ChevronLeft } from 'lucide-react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseWeeklySchedule, generateAvailableSlots, getDayKeyFromDate } from '@/lib/openingHours';
import { cn } from '@/lib/utils';

interface BookingDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: SalonInfo;
  selectedItems: SelectedServiceItem[];
  onCompleteBooking: () => void;
}

export function BookingDrawerModal({
  isOpen,
  onClose,
  salon,
  selectedItems,
  onCompleteBooking,
}: BookingDrawerModalProps) {
  const [step, setStep] = useState<'staff' | 'datetime' | 'details' | 'confirmed'>('staff');

  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(salon.staff[0] || {
    id: 'staff-any',
    name: 'Sans préférence',
    role: 'Premier créneau disponible',
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const weeklySchedule = parseWeeklySchedule(salon.weeklyScheduleJson);
  const totalDuration = selectedItems.reduce((acc, it) => acc + it.service.durationMinutes, 0);
  const totalPrice = selectedItems.reduce((acc, it) => acc + it.service.price, 0);

  // Available slots for selectedDate
  const availableSlots = generateAvailableSlots(selectedDate, weeklySchedule, totalDuration);

  // Next 7 days
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (!customer.firstName.trim() || !customer.lastName.trim()) {
      setErrorMsg('Veuillez renseigner votre prénom et nom.');
      return;
    }
    if (!customer.phone.trim() || customer.phone.length < 8) {
      setErrorMsg('Veuillez renseigner un numéro de portable valide.');
      return;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      setErrorMsg('Veuillez renseigner un email valide.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const bookingId = 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Submit to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://miampos-dashboard.vercel.app';
      try {
        await fetch(`${apiUrl}/api/store/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: salon.slug,
            orderType: 'BOOKING',
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            pickupTime: `${dateStr} ${selectedSlot}`,
            orderNote: `[RDV SALON] Praticien: ${selectedStaff.name} | Durée: ${totalDuration} min | Note: ${customer.notes || 'Aucune'}`,
            items: selectedItems.map((it) => ({
              id: it.service.id,
              name: it.service.name,
              price: it.service.price,
              quantity: 1,
            })),
          }),
        });
      } catch (e) {
        console.warn('Backend sync note:', e);
      }

      setConfirmation({
        bookingId,
        salonName: salon.name,
        salonSlug: salon.slug,
        salonAddress: salon.address,
        salonPhone: salon.phone,
        date: dateStr,
        timeSlot: selectedSlot,
        staffMember: selectedStaff,
        items: selectedItems,
        totalDurationMinutes: totalDuration,
        totalPrice,
        customer,
        createdAt: new Date().toISOString(),
      });

      setStep('confirmed');
    } catch (err) {
      setErrorMsg('Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadIcs = () => {
    if (!confirmation) return;
    const startDateTime = new Date(`${confirmation.date}T${confirmation.timeSlot}:00`);
    const endDateTime = new Date(startDateTime.getTime() + confirmation.totalDurationMinutes * 60000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatIcsDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const summary = `RDV - ${confirmation.salonName}`;
    const description = `Prestations: ${confirmation.items.map(i => i.service.name).join(', ')}\\nCoiffeur: ${confirmation.staffMember.name}\\nRéf: ${confirmation.bookingId}`;
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'staff' && step !== 'confirmed' && (
              <button
                onClick={() => {
                  if (step === 'datetime') setStep('staff');
                  else if (step === 'details') setStep('datetime');
                }}
                className="p-1 -ml-1 text-gray-400 hover:text-gray-700 transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="font-bold text-base text-gray-900 leading-tight">
                {step === 'staff' && "1. Choisissez votre praticien"}
                {step === 'datetime' && "2. Choisissez la date et l'heure"}
                {step === 'details' && "3. Vos coordonnées"}
                {step === 'confirmed' && "Rendez-vous confirmé"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedItems.length} prestation{selectedItems.length > 1 ? 's' : ''} • {totalDuration} min • {totalPrice.toFixed(2)} €
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (step === 'confirmed') onCompleteBooking();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: STAFF */}
          {step === 'staff' && (
            <div className="space-y-3">
              {salon.staff.map((member) => {
                const isSelected = selectedStaff.id === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedStaff(member);
                      setStep('datetime');
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer",
                      isSelected
                        ? "border-black bg-gray-50/50 ring-1 ring-black"
                        : "border-black/[0.08] hover:border-black/20 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {member.initials || member.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition",
                      isSelected ? "border-black bg-black text-white" : "border-gray-300"
                    )}>
                      {isSelected && <Check size={12} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 'datetime' && (
            <div className="space-y-5">
              {/* Date selector pills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Jour de rendez-vous
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {next7Days.map((d, i) => {
                    const isSelected = isSameDay(d, selectedDate);
                    const dayKey = getDayKeyFromDate(d);
                    const isOpen = weeklySchedule[dayKey]?.isOpen;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isOpen) {
                            setSelectedDate(d);
                            setSelectedSlot('');
                          }
                        }}
                        disabled={!isOpen}
                        className={cn(
                          "flex flex-col items-center py-2 px-1 rounded-xl border text-center transition cursor-pointer",
                          isSelected
                            ? "bg-black text-white border-black font-bold shadow-sm"
                            : isOpen
                            ? "bg-white text-gray-800 border-gray-200 hover:border-black"
                            : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60"
                        )}
                      >
                        <span className="text-[10px] uppercase font-semibold">{format(d, 'EEE', { locale: fr })}</span>
                        <span className="text-sm font-extrabold mt-0.5">{format(d, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots grid */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Créneaux disponibles ({format(selectedDate, 'EEEE d MMMM', { locale: fr })})
                </label>
                {availableSlots.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500">
                    Aucun créneau libre pour ce jour avec une durée de {totalDuration} min.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isSlotSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer",
                            isSlotSelected
                              ? "bg-black text-white border-black shadow-sm"
                              : "bg-white text-gray-900 border-gray-200 hover:border-black"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER FORM */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dupont"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone mobile (Rappel SMS) *</label>
                <input
                  type="tel"
                  required
                  placeholder="06 12 34 56 78"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email de confirmation *</label>
                <input
                  type="email"
                  required
                  placeholder="sophie@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarques éventuelles (Optionnel)</label>
                <textarea
                  rows={2}
                  placeholder="Précisions utiles pour l'équipe..."
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                />
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 'confirmed' && confirmation && (
            <div className="space-y-4 py-2">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-center">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check size={20} />
                </div>
                <h3 className="font-extrabold text-base">Rendez-vous confirmé</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Réf: #{confirmation.bookingId}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Date</span>
                  <span className="font-bold text-gray-900">
                    {format(parseISO(confirmation.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Heure</span>
                  <span className="font-bold text-gray-900">{confirmation.timeSlot} ({confirmation.totalDurationMinutes} min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Coiffeur / Styliste</span>
                  <span className="font-bold text-gray-900">{confirmation.staffMember.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Total sur place</span>
                  <span className="font-extrabold text-sm text-gray-900">{confirmation.totalPrice.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={downloadIcs}
                className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Ajouter à mon calendrier (.ics)</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {step !== 'confirmed' && (
          <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            {step === 'staff' && (
              <button
                onClick={() => setStep('datetime')}
                className="w-full py-3 rounded-full bg-black text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuer vers le calendrier</span>
                <ArrowRight size={14} />
              </button>
            )}

            {step === 'datetime' && (
              <button
                onClick={() => {
                  if (!selectedSlot) {
                    setErrorMsg('Veuillez sélectionner un créneau horaire.');
                    return;
                  }
                  setErrorMsg(null);
                  setStep('details');
                }}
                disabled={!selectedSlot}
                className={cn(
                  "w-full py-3 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2",
                  selectedSlot
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                <span>Continuer vers mes coordonnées</span>
                <ArrowRight size={14} />
              </button>
            )}

            {step === 'details' && (
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-black text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? "Validation..." : "Confirmer le rendez-vous"}</span>
                <Check size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
