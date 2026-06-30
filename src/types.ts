export interface CarSpecification {
  range?: string;
  topSpeed?: string;
  zeroToSixty?: string;
  drivetrain?: string;
  power?: string;
  battery?: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  specifications: CarSpecification;
  images: string[]; // URLs or base64 data
  featured: boolean;
  active: boolean; // showing on frontend
  createdAt: string;
}

export interface Inquiry {
  id: string;
  carId: string; // "general" or specific ID
  carName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}

export interface SiteSettings {
  title: string;
  logo: string; // Base64 or icon name or string
  favicon: string; // URL/Base64 or name
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYoutube: string;
  socialFacebook: string;
  primaryColor?: string; // hex
  giveawayVideoUrl?: string;
  proofVideoUrl?: string;
}

export interface DatabaseState {
  cars: Car[];
  inquiries: Inquiry[];
  settings: SiteSettings;
}
