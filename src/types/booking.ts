export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
  color?: string;
  specialties?: string[];
  isAvailable?: boolean;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  durationMinutes?: number;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  image?: string;
  options?: ServiceOption[];
  sortOrder?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  services: ServiceItem[];
}

export interface SalonInfo {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  themeColor: string;
  phone?: string;
  address?: string;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  weeklyScheduleJson?: string;
  staff: StaffMember[];
  categories: ServiceCategory[];
}

export interface SelectedServiceItem {
  service: ServiceItem;
  selectedOptions: ServiceOption[];
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface AppointmentConfirmation {
  bookingId: string;
  salonName: string;
  salonSlug: string;
  salonPhone?: string;
  salonAddress?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  staffMember: StaffMember;
  items: SelectedServiceItem[];
  totalDurationMinutes: number;
  totalPrice: number;
  customer: CustomerData;
  createdAt: string;
}
