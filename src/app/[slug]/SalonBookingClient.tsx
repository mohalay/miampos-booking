'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BookingProgress, BookingStep } from '@/components/BookingProgress';
import { ServiceSelector } from '@/components/ServiceSelector';
import { StaffSelector } from '@/components/StaffSelector';
import { CalendarSelector } from '@/components/CalendarSelector';
import { CustomerForm } from '@/components/CustomerForm';
import { BookingSummaryBar } from '@/components/BookingSummaryBar';
import { NativeConfirmationModal } from '@/components/NativeConfirmationModal';
import {
  SalonInfo,
  ServiceItem,
  ServiceOption,
  SelectedServiceItem,
  StaffMember,
  CustomerData,
  AppointmentConfirmation,
} from '@/types/booking';
import { fetchSalonData, DEMO_SALON } from '@/lib/api';
import { parseWeeklySchedule } from '@/lib/openingHours';
import { format } from 'date-fns';

export function SalonBookingClient({ slug }: { slug: string }) {
  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');

  // Booking states
  const [selectedItems, setSelectedItems] = useState<SelectedServiceItem[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSalonData(slug);
        setSalon(data);
        if (data.staff && data.staff.length > 0) {
          setSelectedStaff(data.staff[0]); // default to "Sans préférence"
        }
      } catch (e) {
        console.error('Error loading salon:', e);
        setSalon(DEMO_SALON);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading || !salon) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        gap: '16px',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>
          Chargement de votre salon...
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const weeklySchedule = parseWeeklySchedule(salon.weeklyScheduleJson);

  // Compute total duration of all selected services + options
  const totalDurationMinutes = selectedItems.reduce((sum, item) => {
    const optsDur = item.selectedOptions.reduce((s, o) => s + (o.durationMinutes || 0), 0);
    return sum + item.service.durationMinutes + optsDur;
  }, 0);

  // Compute total price
  const totalPrice = selectedItems.reduce((sum, item) => {
    const optsPrice = item.selectedOptions.reduce((s, o) => s + o.price, 0);
    return sum + item.service.price + optsPrice;
  }, 0);

  // Service toggle handler
  const handleToggleService = (service: ServiceItem) => {
    setErrorMessage(null);
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.service.id === service.id);
      if (exists) {
        return prev.filter((item) => item.service.id !== service.id);
      } else {
        return [...prev, { service, selectedOptions: [] }];
      }
    });
  };

  // Option toggle handler
  const handleToggleOption = (serviceId: string, option: ServiceOption) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.service.id !== serviceId) return item;
        const optExists = item.selectedOptions.some((o) => o.id === option.id);
        const newOpts = optExists
          ? item.selectedOptions.filter((o) => o.id !== option.id)
          : [...item.selectedOptions, option];
        return { ...item, selectedOptions: newOpts };
      })
    );
  };

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setErrorMessage(null);
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const canNavigateTo = (step: BookingStep): boolean => {
    if (step === 'services') return true;
    if (step === 'staff') return selectedItems.length > 0;
    if (step === 'datetime') return selectedItems.length > 0 && selectedStaff !== null;
    if (step === 'details')
      return selectedItems.length > 0 && selectedStaff !== null && selectedSlot !== '';
    return false;
  };

  const handleNextStep = async () => {
    setErrorMessage(null);

    if (currentStep === 'services') {
      if (selectedItems.length === 0) {
        setErrorMessage('Veuillez sélectionner au moins une prestation pour continuer.');
        return;
      }
      setCurrentStep('staff');
      window.scrollTo({ top: 220, behavior: 'smooth' });
    } else if (currentStep === 'staff') {
      if (!selectedStaff) {
        setSelectedStaff(salon.staff[0]);
      }
      setCurrentStep('datetime');
      window.scrollTo({ top: 220, behavior: 'smooth' });
    } else if (currentStep === 'datetime') {
      if (!selectedSlot) {
        setErrorMessage('Veuillez sélectionner un créneau horaire disponible.');
        return;
      }
      setCurrentStep('details');
      window.scrollTo({ top: 220, behavior: 'smooth' });
    } else if (currentStep === 'details') {
      // Validate customer details
      if (!customer.firstName.trim() || !customer.lastName.trim()) {
        setErrorMessage('Veuillez renseigner votre nom et votre prénom.');
        return;
      }
      if (!customer.phone.trim() || customer.phone.length < 8) {
        setErrorMessage('Veuillez renseigner un numéro de téléphone portable valide.');
        return;
      }
      if (!customer.email.trim() || !customer.email.includes('@')) {
        setErrorMessage('Veuillez renseigner une adresse email valide.');
        return;
      }

      // Submit booking
      setIsSubmitting(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const bookingId = 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Optional API call to MiamPOS backend
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
              orderNote: `[RDV SALON] Praticien: ${selectedStaff?.name} | Durée: ${totalDurationMinutes} min | Note: ${customer.notes || 'Aucune'}`,
              items: selectedItems.map((it) => ({
                id: it.service.id,
                name: it.service.name,
                price: it.service.price,
                quantity: 1,
                options: it.selectedOptions.map((o) => o.name),
              })),
            }),
          });
        } catch (apiErr) {
          console.warn('[SalonBooking] Backend order sync warning:', apiErr);
        }

        // Set native confirmation modal state
        setConfirmation({
          bookingId,
          salonName: salon.name,
          salonSlug: salon.slug,
          salonAddress: salon.address,
          salonPhone: salon.phone,
          date: dateStr,
          timeSlot: selectedSlot,
          staffMember: selectedStaff || salon.staff[0],
          items: selectedItems,
          totalDurationMinutes,
          totalPrice,
          customer,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Booking submission error:', err);
        setErrorMessage('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setConfirmation(null);
    setSelectedItems([]);
    setSelectedSlot('');
    setCurrentStep('services');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Salon Header Hero */}
      <Header salon={salon} />

      {/* Main Container */}
      <main className="booking-container">
        {/* Step Progress Tracker */}
        <BookingProgress
          currentStep={currentStep}
          onStepClick={(step) => {
            setErrorMessage(null);
            setCurrentStep(step);
          }}
          canNavigateTo={canNavigateTo}
        />

        {/* Error notification alert */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {errorMessage}
          </div>
        )}

        {/* Step 1: Services */}
        {currentStep === 'services' && (
          <ServiceSelector
            categories={salon.categories}
            selectedItems={selectedItems}
            onToggleService={handleToggleService}
            onToggleOption={handleToggleOption}
          />
        )}

        {/* Step 2: Staff */}
        {currentStep === 'staff' && (
          <StaffSelector
            staffList={salon.staff}
            selectedStaff={selectedStaff}
            onSelectStaff={(st) => {
              setSelectedStaff(st);
              setErrorMessage(null);
            }}
          />
        )}

        {/* Step 3: Date & Slot */}
        {currentStep === 'datetime' && (
          <CalendarSelector
            schedule={weeklySchedule}
            totalDurationMinutes={totalDurationMinutes}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setSelectedSlot('');
            }}
            onSelectSlot={(s) => {
              setSelectedSlot(s);
              setErrorMessage(null);
            }}
          />
        )}

        {/* Step 4: Customer Details */}
        {currentStep === 'details' && (
          <CustomerForm
            customer={customer}
            onChange={handleCustomerChange}
          />
        )}

        {/* Floating Bottom Summary & Action Bar */}
        <BookingSummaryBar
          currentStep={currentStep}
          items={selectedItems}
          staff={selectedStaff}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          isSubmitting={isSubmitting}
          onNext={handleNextStep}
        />

        {/* Native confirmation modal on success */}
        <NativeConfirmationModal
          confirmation={confirmation}
          onClose={handleReset}
        />
      </main>
    </div>
  );
}
