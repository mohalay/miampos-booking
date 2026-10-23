import Link from 'next/link';
import { ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Navbar */}
      <header className="bg-white border-b border-black/[0.06] h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-lg tracking-tight text-gray-900">
            <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              M
            </span>
            <span>MiamPOS <span className="text-red-500">Booking</span></span>
          </div>

          <Link
            href="/atelier-coiffure"
            className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition active:scale-95"
          >
            Salon Démo
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-5">
          Espace de prise de rendez-vous en ligne
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Réservez votre prestation salon en toute simplicité.
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Sélectionnez vos soins, choisissez votre coiffeur préféré et validez votre créneau en temps réel avec synchronisation directe en caisse.
        </p>

        <div className="flex justify-center">
          <Link
            href="/atelier-coiffure"
            className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg active:scale-95"
          >
            <span>Accéder à la prise de rendez-vous</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 3 Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 text-left">
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 mb-3 border border-gray-100">
              <Clock size={16} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Créneaux en temps réel</h3>
            <p className="text-xs text-gray-500 mt-1">Calcul précis selon la durée cumulée de vos prestations.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 mb-3 border border-gray-100">
              <MapPin size={16} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Choix du praticien</h3>
            <p className="text-xs text-gray-500 mt-1">Sélectionnez votre coiffeur habituel ou optez pour le premier créneau libre.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 mb-3 border border-gray-100">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Synchronisé en caisse</h3>
            <p className="text-xs text-gray-500 mt-1">Votre rendez-vous arrive directement sur le planning du salon MiamPOS.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-6 text-center text-xs text-gray-400 bg-white">
        © 2026 MiamPOS • Écosystème Caisse & Prise de rendez-vous pour Salons et Instituts
      </footer>
    </div>
  );
}
