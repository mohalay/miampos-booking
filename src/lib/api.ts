import { SalonInfo, StaffMember } from '@/types/booking';

export const DEMO_STAFF: StaffMember[] = [
  {
    id: 'staff-any',
    name: 'Sans préférence',
    role: 'Premier créneau disponible',
    initials: '✨',
    color: '#EC4899',
    specialties: ['Toutes prestations', 'Disponibilité rapide'],
    isAvailable: true,
  },
  {
    id: 'staff-1',
    name: 'Sarah',
    role: 'Maître Coiffeuse & Visagiste',
    initials: 'SC',
    color: '#8b5cf6',
    specialties: ['Coupes créatives', 'Conseil Morpho-visage', 'Brushing Signature'],
    isAvailable: true,
  },
  {
    id: 'staff-2',
    name: 'Alexandre',
    role: 'Coloriste Expert & Balayages',
    initials: 'AL',
    color: '#f59e0b',
    specialties: ['Balayage Dégradé', 'Ombré Hair', 'Patines & Gloss'],
    isAvailable: true,
  },
  {
    id: 'staff-3',
    name: 'Inès',
    role: 'Styliste & Spécialiste Soins',
    initials: 'IB',
    color: '#10b981',
    specialties: ['Soin Botox Capillaire', 'Lissage Français', 'Massage Cuir Chevelu'],
    isAvailable: true,
  },
];

export const DEMO_SALON: SalonInfo = {
  id: 'salon-demo',
  slug: 'atelier-coiffure',
  name: 'L’Atelier Coiffure & Beauté',
  description: 'Salon de haute coiffure, soins experts et colorations d’exception dans un cadre chaleureux et raffiné.',
  logoUrl: '',
  bannerUrl: '',
  themeColor: '#EC4899',
  phone: '01 42 68 34 50',
  address: '18 Rue de la Paix, 75002 Paris',
  email: 'contact@atelier-coiffure.fr',
  instagramUrl: 'https://instagram.com/latelier_coiffure',
  staff: DEMO_STAFF,
  categories: [
    {
      id: 'cat-femme',
      name: 'Coiffure & Coupe Femme',
      description: 'Shampoing traitant, diagnostic personnalisé, coupe et coiffage',
      services: [
        {
          id: 'serv-1',
          categoryId: 'cat-femme',
          name: 'Forfait Coupe, Shampoing & Brushing',
          description: 'Diagnostic capillaire, shampoing relaxant, coupe sur-mesure et brushing élégant.',
          price: 48,
          durationMinutes: 45,
          options: [
            { id: 'opt-1', name: 'Soin Masque Réparateur Intense', price: 12, durationMinutes: 10 },
            { id: 'opt-2', name: 'Massage Crânien Shiatsu (15 min)', price: 18, durationMinutes: 15 },
          ]
        },
        {
          id: 'serv-2',
          categoryId: 'cat-femme',
          name: 'Brushing Stylisé / Wavy',
          description: 'Shampoing spécifique et brushing lisse souple ou boucles wavy longue tenue.',
          price: 32,
          durationMinutes: 30,
          options: [
            { id: 'opt-3', name: 'Fixateur Thermo-protecteur Ultime', price: 6, durationMinutes: 0 },
          ]
        },
        {
          id: 'serv-3',
          categoryId: 'cat-femme',
          name: 'Transformation Coupe Styliste',
          description: 'Changement de style complet, conseils morphologie visage et finitions texturisantes.',
          price: 65,
          durationMinutes: 60,
        }
      ]
    },
    {
      id: 'cat-couleur',
      name: 'Colorations, Balayages & Éclaircissements',
      description: 'Techniques exclusives de fondu, reflets lumineux et brillance miroir',
      services: [
        {
          id: 'serv-4',
          categoryId: 'cat-couleur',
          name: 'Balayage Signature & Gloss Patine',
          description: 'Éclaircissement délicat en fondu naturel, patine neutralisante et soin brillance.',
          price: 110,
          durationMinutes: 90,
          options: [
            { id: 'opt-4', name: 'Traitement Anti-Casse Olaplex / Bond-Builder', price: 25, durationMinutes: 15 },
            { id: 'opt-5', name: 'Coupe des Pointes post-éclaircissement', price: 20, durationMinutes: 20 },
          ]
        },
        {
          id: 'serv-5',
          categoryId: 'cat-couleur',
          name: 'Couleur Racines & Brillance',
          description: 'Couverture 100% cheveux blancs, nuance lumineuse sans ammoniaque.',
          price: 52,
          durationMinutes: 60,
        },
        {
          id: 'serv-6',
          categoryId: 'cat-couleur',
          name: 'Ombré Hair & Contouring Visage',
          description: 'Mise en valeur des traits du visage par des mèches d’accroche lumière.',
          price: 135,
          durationMinutes: 120,
        }
      ]
    },
    {
      id: 'cat-soins',
      name: 'Soins Profonds & Rituels Spa',
      description: 'Régénération de la fibre capillaire et nutrition en profondeur',
      services: [
        {
          id: 'serv-7',
          categoryId: 'cat-soins',
          name: 'Rituel Botox Capillaire Rénovateur',
          description: 'Cure d’acide hyaluronique et kératine pure pour réhydrater et gainer le cheveu.',
          price: 85,
          durationMinutes: 75,
        },
        {
          id: 'serv-8',
          categoryId: 'cat-soins',
          name: 'Soin Détoxifiant & Exfoliant Cuir Chevelu',
          description: 'Gommage aux sels minéraux, massage drainant et masque purifiant.',
          price: 45,
          durationMinutes: 40,
        }
      ]
    },
    {
      id: 'cat-homme',
      name: 'Espace Homme & Barbe',
      description: 'Coupes modernes, dégradés à blanc et entretien traditionnel de la barbe',
      services: [
        {
          id: 'serv-9',
          categoryId: 'cat-homme',
          name: 'Forfait Coupe Homme & Shampoing',
          description: 'Coupe aux ciseaux et tondeuse de précision, shampoing rafraîchissant et coiffage.',
          price: 26,
          durationMinutes: 30,
        },
        {
          id: 'serv-10',
          categoryId: 'cat-homme',
          name: 'Taille & Soin de Barbe à l’Ancienne',
          description: 'Tracé net aux ciseaux et rasoir, serviette chaude et huile tonifiante.',
          price: 22,
          durationMinutes: 25,
        },
        {
          id: 'serv-11',
          categoryId: 'cat-homme',
          name: 'Combo Coupe + Barbe Prestige',
          description: 'Le soin masculin complet avec serviette chaude, massage et coiffage haut de gamme.',
          price: 44,
          durationMinutes: 50,
        }
      ]
    }
  ]
};

export async function fetchSalonData(slug: string): Promise<SalonInfo> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://miampos-dashboard.vercel.app';

  try {
    const res = await fetch(`${apiUrl}/api/store/sync?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.warn('[fetchSalonData] API response not ok, fallback to demo salon');
      return { ...DEMO_SALON, slug };
    }

    const data = await res.json();
    if (!data.merchant) {
      return { ...DEMO_SALON, slug };
    }

    const m = data.merchant;
    const s = data.settings || {};

    const categories: any[] = (data.categories || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      services: (data.products || [])
        .filter((p: any) => p.categoryId === c.id)
        .map((p: any) => ({
          id: p.id,
          categoryId: c.id,
          name: p.name,
          description: p.description,
          price: Number(p.price || 0),
          durationMinutes: Number(p.durationMinutes || p.content || 30),
          image: p.image,
          options: (data.modifiers || [])
            .flatMap((mg: any) => mg.options || [])
            .map((opt: any) => ({
              id: opt.id,
              name: opt.name,
              price: Number(opt.price || 0),
            })),
        }))
    }));

    return {
      id: m.id,
      slug: m.slug || slug,
      name: m.business_name || DEMO_SALON.name,
      description: s.storeDescription || DEMO_SALON.description,
      logoUrl: m.logo_url || s.promoBanner,
      bannerUrl: s.backgroundUrl,
      themeColor: s.themeColor || m.primary_color || '#EC4899',
      phone: s.storePhone || DEMO_SALON.phone,
      address: s.storeAddress || DEMO_SALON.address,
      email: s.storeEmail || m.email,
      instagramUrl: s.instagramUrl,
      facebookUrl: s.facebookUrl,
      weeklyScheduleJson: s.clickCollectHours,
      staff: DEMO_STAFF,
      categories: categories.length > 0 ? categories : DEMO_SALON.categories,
    };
  } catch (err) {
    console.error('[fetchSalonData] Error fetching salon data:', err);
    return { ...DEMO_SALON, slug };
  }
}
