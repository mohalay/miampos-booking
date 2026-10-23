'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ServiceCard } from '@/components/ServiceCard';
import { BookingBar } from '@/components/BookingBar';
import { BookingDrawerModal } from '@/components/BookingDrawerModal';
import { SalonInfo, ServiceItem, SelectedServiceItem } from '@/types/booking';
import { fetchSalonData, DEMO_SALON } from '@/lib/api';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SalonBookingClient({ slug }: { slug: string }) {
  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SelectedServiceItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSalonData(slug);
        setSalon(data);
        if (data.categories && data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
      } catch (e) {
        console.error('Error loading salon:', e);
        setSalon(DEMO_SALON);
        setSelectedCategoryId(DEMO_SALON.categories[0].id);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading || !salon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-medium">Chargement du salon...</span>
        </div>
      </div>
    );
  }

  const handleToggleService = (service: ServiceItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((it) => it.service.id === service.id);
      if (exists) {
        return prev.filter((it) => it.service.id !== service.id);
      } else {
        return [...prev, { service, selectedOptions: [] }];
      }
    });
  };

  // Filter services by category and search
  const filteredCategories = salon.categories.filter((cat) => {
    if (selectedCategoryId && selectedCategoryId !== 'all' && cat.id !== selectedCategoryId) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-32">
      {/* Top Navbar */}
      <Navbar salon={salon} />

      {/* Hero Announcement Banner if provided */}
      {salon.bannerUrl && (
        <div className="w-full h-40 sm:h-52 relative overflow-hidden bg-gray-900">
          <img
            src={salon.bannerUrl}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Salon Intro / Slogan */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Réserver une prestation
          </h1>
          {salon.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              {salon.description}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une coupe, balayage, forfait, soin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black shadow-xs transition"
          />
        </div>

        {/* Category Pills (Sticky horizontal bar) */}
        <div className="sticky top-16 z-20 bg-[#f9fafb]/90 backdrop-blur-md py-2.5 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto hide-scrollbar flex items-center gap-2">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold shrink-0 transition active:scale-95 cursor-pointer",
              selectedCategoryId === 'all'
                ? "bg-black text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            )}
          >
            Toutes les prestations
          </button>

          {salon.categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold shrink-0 transition active:scale-95 cursor-pointer",
                  isSelected
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Services Grouped by Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const services = category.services.filter((s) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
            });

            if (services.length === 0) return null;

            return (
              <section key={category.id} className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-gray-100 pb-2">
                  <h2 className="font-extrabold text-base text-gray-900 tracking-tight">
                    {category.name}
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">
                    {services.length} prestation{services.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {services.map((service) => {
                    const isSelected = selectedItems.some((it) => it.service.id === service.id);
                    return (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={isSelected}
                        onToggle={handleToggleService}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Summary Bar */}
      <BookingBar
        selectedItems={selectedItems}
        onOpenBooking={() => setIsDrawerOpen(true)}
      />

      {/* Booking Slide-over Drawer Modal */}
      <BookingDrawerModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        salon={salon}
        selectedItems={selectedItems}
        onCompleteBooking={() => {
          setSelectedItems([]);
        }}
      />
    </div>
  );
}
