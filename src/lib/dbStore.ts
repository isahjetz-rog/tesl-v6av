import { Car, Inquiry, SiteSettings, DatabaseState } from '../types.js';

// Initial default data matching db.json with 17 custom-configured Tesla vehicles
const INITIAL_DATA: DatabaseState = {
  cars: [
    {
      id: "tesla-1-cybertruck-awd",
      name: "Tesla Cybertruck AWD",
      brand: "Tesla",
      model: "AWD Cybertruck",
      year: 2025,
      price: 379,
      description: "Shatter-resistant armor glass, stainless steel exoskeleton, and unmatched off-road capability. Cybertruck is built for any planet.",
      specifications: {
        range: "340 mi",
        topSpeed: "112 mph",
        zeroToSixty: "4.1 s",
        drivetrain: "Dual Motor AWD",
        power: "600 hp",
        battery: "123 kWh"
      },
      images: ["/images/tesla_cybertruck.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T10:00:00.000Z"
    },
    {
      id: "tesla-2-roadster-concept",
      name: "Tesla Roadster",
      brand: "Tesla",
      model: "Roadster 2.0",
      year: 2025,
      price: 499,
      description: "The quickest car in the world, with record-setting acceleration, range, and extreme aerodynamic performance in an elegant open-top supercar.",
      specifications: {
        range: "620 mi",
        topSpeed: "250+ mph",
        zeroToSixty: "1.9 s",
        drivetrain: "Quad Motor AWD",
        power: "1200+ hp",
        battery: "200 kWh"
      },
      images: ["/images/tesla_model_s.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T09:45:00.000Z"
    },
    {
      id: "tesla-3-model-3-sr",
      name: "Tesla Model 3 SR",
      brand: "Tesla",
      model: "Standard Range 3",
      price: 199,
      year: 2025,
      description: "Optimized for city commuting with exceptional daily range, ultra-responsive handling, and standard autopilot features.",
      specifications: {
        range: "272 mi",
        topSpeed: "125 mph",
        zeroToSixty: "5.8 s",
        drivetrain: "RWD",
        power: "283 hp",
        battery: "57.5 kWh"
      },
      images: ["/images/tesla_model_3.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T09:30:00.000Z"
    },
    {
      id: "tesla-4-model-y-lr",
      name: "Tesla Model Y LR",
      brand: "Tesla",
      model: "Long Range Y",
      price: 329,
      year: 2025,
      description: "The perfect balance of athletic crossover utility and high-efficiency performance. Expansive seating and premium audio system.",
      specifications: {
        range: "330 mi",
        topSpeed: "135 mph",
        zeroToSixty: "4.8 s",
        drivetrain: "Dual Motor AWD",
        power: "384 hp",
        battery: "81 kWh"
      },
      images: ["/images/tesla_model_y.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T09:15:00.000Z"
    },
    {
      id: "tesla-5-model-s-plaid",
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      model: "Plaid S",
      price: 399,
      year: 2025,
      description: "Ludicrous performance. Tri-motor torque vectoring provides instant power delivery, matching elite sports car dynamics.",
      specifications: {
        range: "359 mi",
        topSpeed: "200 mph",
        zeroToSixty: "1.99 s",
        drivetrain: "Tri-Motor AWD",
        power: "1,020 hp",
        battery: "100 kWh"
      },
      images: ["/images/tesla_model_s.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T09:00:00.000Z"
    },
    {
      id: "tesla-6-model-x-plaid",
      name: "Tesla Model X Plaid",
      brand: "Tesla",
      model: "Plaid X",
      price: 419,
      year: 2025,
      description: "Ultimate high-performance utility vehicle featuring iconic automated Falcon Wing passenger doors and panoramic views.",
      specifications: {
        range: "326 mi",
        topSpeed: "163 mph",
        zeroToSixty: "2.5 s",
        drivetrain: "Tri-Motor AWD",
        power: "1,020 hp",
        battery: "100 kWh"
      },
      images: ["/images/tesla_model_y.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T08:45:00.000Z"
    },
    {
      id: "tesla-7-cyberbeast-tri",
      name: "Tesla Cyberbeast",
      brand: "Tesla",
      model: "Cyberbeast Tri-Motor",
      price: 449,
      year: 2025,
      description: "Extreme performance stainless steel super-truck equipped with dynamic steer-by-wire and active locking differentials.",
      specifications: {
        range: "320 mi",
        topSpeed: "130 mph",
        zeroToSixty: "2.6 s",
        drivetrain: "Tri-Motor AWD",
        power: "845 hp",
        battery: "123 kWh"
      },
      images: ["/images/tesla_cybertruck.jpg"],
      featured: true,
      active: true,
      createdAt: "2026-06-25T08:30:00.000Z"
    },
    {
      id: "tesla-8-model-3-perf",
      name: "Tesla Model 3 Performance",
      brand: "Tesla",
      model: "Performance 3",
      price: 289,
      year: 2025,
      description: "Track-ready layout with bespoke adaptive damping suspension, track mode V3, and carbon fiber spoilers.",
      specifications: {
        range: "303 mi",
        topSpeed: "163 mph",
        zeroToSixty: "2.9 s",
        drivetrain: "Dual Motor AWD",
        power: "510 hp",
        battery: "75 kWh"
      },
      images: ["/images/tesla_model_3.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T08:15:00.000Z"
    },
    {
      id: "tesla-9-model-y-perf",
      name: "Tesla Model Y Performance",
      brand: "Tesla",
      model: "Performance Y",
      price: 349,
      year: 2025,
      description: "Combining high utility crossover volume with sports car agility, custom performance brakes, and 21-inch alloy wheels.",
      specifications: {
        range: "279 mi",
        topSpeed: "155 mph",
        zeroToSixty: "3.5 s",
        drivetrain: "Dual Motor AWD",
        power: "456 hp",
        battery: "81 kWh"
      },
      images: ["/images/tesla_model_y.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T08:00:00.000Z"
    },
    {
      id: "tesla-10-model-s-lr",
      name: "Tesla Model S LR",
      brand: "Tesla",
      model: "Long Range S",
      price: 319,
      year: 2025,
      description: "Setting the executive standard for ultra luxury long range electric travel, with standard air suspension.",
      specifications: {
        range: "405 mi",
        topSpeed: "149 mph",
        zeroToSixty: "3.1 s",
        drivetrain: "Dual Motor AWD",
        power: "670 hp",
        battery: "100 kWh"
      },
      images: ["/images/tesla_model_s.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T07:45:00.000Z"
    },
    {
      id: "tesla-11-model-x-lr",
      name: "Tesla Model X LR",
      brand: "Tesla",
      model: "Long Range X",
      price: 359,
      year: 2025,
      description: "Extravagant high-capacity luxury layout with automated door control, active air filters, and premier safety standard.",
      specifications: {
        range: "348 mi",
        topSpeed: "149 mph",
        zeroToSixty: "3.8 s",
        drivetrain: "Dual Motor AWD",
        power: "670 hp",
        battery: "100 kWh"
      },
      images: ["/images/tesla_model_y.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T07:30:00.000Z"
    },
    {
      id: "tesla-12-cybertruck-rwd",
      name: "Tesla Cybertruck RWD",
      brand: "Tesla",
      model: "RWD Cybertruck",
      price: 269,
      year: 2025,
      description: "Sleek stainless utility in a high-efficiency single motor rear-wheel drive setup for premium urban transit.",
      specifications: {
        range: "250 mi",
        topSpeed: "110 mph",
        zeroToSixty: "6.5 s",
        drivetrain: "RWD",
        power: "315 hp",
        battery: "90 kWh"
      },
      images: ["/images/tesla_cybertruck.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T07:15:00.000Z"
    },
    {
      id: "tesla-13-model-3-highland",
      name: "Tesla Model 3 Highland",
      brand: "Tesla",
      model: "Highland LR",
      price: 249,
      year: 2025,
      description: "The refreshed highland specification featuring dual acoustic windows, rear interactive entertainment displays, and ambient lights.",
      specifications: {
        range: "341 mi",
        topSpeed: "125 mph",
        zeroToSixty: "4.2 s",
        drivetrain: "Dual Motor AWD",
        power: "394 hp",
        battery: "81 kWh"
      },
      images: ["/images/tesla_model_3.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T07:00:00.000Z"
    },
    {
      id: "tesla-14-model-y-rwd",
      name: "Tesla Model Y RWD",
      brand: "Tesla",
      model: "RWD Crossover",
      price: 229,
      year: 2025,
      description: "Rear-wheel drive utility configuration offering premium seating, impressive storage capacity, and lightweight build.",
      specifications: {
        range: "244 mi",
        topSpeed: "135 mph",
        zeroToSixty: "6.6 s",
        drivetrain: "RWD",
        power: "295 hp",
        battery: "60 kWh"
      },
      images: ["/images/tesla_model_y.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T06:45:00.000Z"
    },
    {
      id: "tesla-15-roadster-founders",
      name: "Tesla Roadster Founders",
      brand: "Tesla",
      model: "Founders Edition",
      price: 599,
      year: 2025,
      description: "Highly exclusive limited edition supercar layout with standard carbon aero wheels, handcrafted details, and premium badging.",
      specifications: {
        range: "620 mi",
        topSpeed: "250+ mph",
        zeroToSixty: "1.9 s",
        drivetrain: "Quad Motor AWD",
        power: "1200+ hp",
        battery: "200 kWh"
      },
      images: ["/images/tesla_model_s.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T06:30:00.000Z"
    },
    {
      id: "tesla-16-model-s-sig",
      name: "Tesla Model S Signature",
      brand: "Tesla",
      model: "Signature S",
      price: 459,
      year: 2025,
      description: "Custom metallic trim finish combined with executive cabin audio, customized dynamic spoilers, and signature upholstery.",
      specifications: {
        range: "405 mi",
        topSpeed: "155 mph",
        zeroToSixty: "2.8 s",
        drivetrain: "Dual Motor AWD",
        power: "762 hp",
        battery: "100 kWh"
      },
      images: ["/images/tesla_model_s.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T06:15:00.000Z"
    },
    {
      id: "tesla-17-cyberbeast-stealth",
      name: "Tesla Cyberbeast Stealth",
      brand: "Tesla",
      model: "Stealth Cyberbeast",
      price: 489,
      year: 2025,
      description: "Bespoke matte satin-black military armor coating package with stealth dark premium wheels and rugged interior elements.",
      specifications: {
        range: "320 mi",
        topSpeed: "130 mph",
        zeroToSixty: "2.6 s",
        drivetrain: "Tri-Motor AWD",
        power: "845 hp",
        battery: "123 kWh"
      },
      images: ["/images/tesla_cybertruck.jpg"],
      featured: false,
      active: true,
      createdAt: "2026-06-25T06:00:00.000Z"
    }
  ],
  inquiries: [
    {
      id: "inq-1",
      carId: "tesla-5-model-s-plaid",
      carName: "Tesla Model S Plaid",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      message: "Hello! I am very interested in scheduling a digital preview or a demo drive for the Model S Plaid. Let me know what dates are available next week.",
      status: "pending",
      createdAt: "2026-06-22T02:15:00.000Z"
    },
    {
      id: "inq-2",
      carId: "tesla-7-cyberbeast-tri",
      carName: "Tesla Cyberbeast",
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      phone: "+1 (555) 987-6543",
      message: "Is the Cyberbeast eligible for the commercial clean vehicle tax credit, and can I configure it with the tactical grey interior accent package?",
      status: "contacted",
      createdAt: "2026-06-22T03:40:00.000Z"
    }
  ],
  settings: {
    title: "TESLA INVENTORY",
    logo: "TESLA",
    favicon: "T",
    contactEmail: "sales@tesla-inventory.com",
    contactPhone: "+1 (800) 555-0199",
    contactAddress: "3500 Deer Creek Road, Palo Alto, CA 94304",
    socialTwitter: "https://twitter.com/tesla",
    socialInstagram: "https://instagram.com/tesla",
    socialYoutube: "https://youtube.com/tesla",
    socialFacebook: "https://facebook.com/tesla",
    primaryColor: "#e82127",
    giveawayVideoUrl: "https://www.youtube.com/embed/XxOh12Jn7Y4?rel=0&modestbranding=1&fs=1&playsinline=1",
    proofVideoUrl: "https://www.youtube.com/embed/78g0T9vTclY?rel=0&modestbranding=1&fs=1&playsinline=1"
  }
};

const STORAGE_KEY = 'tesla_inventory_db_state';

function sanitizeImagePath(path: string): string {
  if (!path) return '';
  if (path.startsWith('data:image/') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Convert any backslashes to forward slashes
  let sanitized = path.replace(/\\/g, '/');
  // Strip any Windows drive letters like C:/ or D:/ or similar
  sanitized = sanitized.replace(/^[a-zA-Z]:\//, '/');
  // Strip any local paths like C:/Users/.../images/... to just /images/...
  if (sanitized.includes('/images/')) {
    sanitized = '/images/' + sanitized.split('/images/')[1];
  } else if (sanitized.includes('assets/images/')) {
    sanitized = '/images/' + sanitized.split('assets/images/')[1];
  }
  return sanitized;
}

function getDB(): DatabaseState {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  try {
    const parsed = JSON.parse(data);
    // Auto-migrate if database is present but lacks our 17 sample Tesla vehicles
    if (!parsed.cars || parsed.cars.length < 17) {
      parsed.cars = INITIAL_DATA.cars;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    
    // Sanitize image paths to ensure standard absolute paths without backslashes or local Windows drives
    if (parsed.cars) {
      parsed.cars = parsed.cars.map((car: Car) => {
        if (car.images) {
          car.images = car.images.map(img => {
            if (typeof img === 'string') {
              return sanitizeImagePath(img);
            }
            return img;
          });
        }
        return car;
      });
    }
    
    return parsed;
  } catch (e) {
    return INITIAL_DATA;
  }
}

function saveDB(db: DatabaseState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export const dbStore = {
  getSettings(): SiteSettings {
    const db = getDB();
    return db.settings;
  },

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const db = getDB();
    db.settings = { ...db.settings, ...newSettings };
    saveDB(db);
    return db.settings;
  },

  getCars(all: boolean = true): Car[] {
    const db = getDB();
    if (all) {
      return db.cars;
    }
    return db.cars.filter(car => car.active);
  },

  createCar(carData: Partial<Car>): Car {
    const db = getDB();
    const newCar: Car = {
      id: carData.id || `car_${Date.now()}`,
      name: carData.name || 'Unnamed Car',
      brand: carData.brand || 'Tesla',
      model: carData.model || '',
      year: Number(carData.year) || new Date().getFullYear(),
      price: Number(carData.price) || 0,
      description: carData.description || '',
      specifications: carData.specifications || {},
      images: carData.images || [],
      featured: carData.featured === true,
      active: carData.active === true,
      createdAt: new Date().toISOString()
    };
    db.cars.unshift(newCar);
    saveDB(db);
    return newCar;
  },

  updateCar(carId: string, carData: Partial<Car>): Car {
    const db = getDB();
    const index = db.cars.findIndex(car => car.id === carId);
    if (index === -1) {
      throw new Error('Car not found');
    }
    const existingCar = db.cars[index];
    const updatedCar: Car = {
      ...existingCar,
      ...carData,
      year: carData.year !== undefined ? Number(carData.year) : existingCar.year,
      price: carData.price !== undefined ? Number(carData.price) : existingCar.price,
      specifications: {
        ...existingCar.specifications,
        ...carData.specifications
      }
    };
    db.cars[index] = updatedCar;
    saveDB(db);
    return updatedCar;
  },

  deleteCar(carId: string): void {
    const db = getDB();
    db.cars = db.cars.filter(car => car.id !== carId);
    saveDB(db);
  },

  getInquiries(): Inquiry[] {
    const db = getDB();
    return db.inquiries;
  },

  createInquiry(inquiryData: Partial<Inquiry>): Inquiry {
    const db = getDB();
    const newInquiry: Inquiry = {
      id: `inq_${Date.now()}`,
      carId: inquiryData.carId || 'general',
      carName: inquiryData.carName || 'General Inquiry',
      name: inquiryData.name || '',
      email: inquiryData.email || '',
      phone: inquiryData.phone || '',
      message: inquiryData.message || '',
      status: inquiryData.status || 'pending',
      createdAt: new Date().toISOString()
    };
    db.inquiries.unshift(newInquiry);
    saveDB(db);
    return newInquiry;
  },

  updateInquiryStatus(inqId: string, status: 'pending' | 'contacted' | 'completed'): Inquiry {
    const db = getDB();
    const index = db.inquiries.findIndex(inq => inq.id === inqId);
    if (index === -1) {
      throw new Error('Inquiry not found');
    }
    db.inquiries[index].status = status;
    saveDB(db);
    return db.inquiries[index];
  },

  deleteInquiry(inqId: string): void {
    const db = getDB();
    db.inquiries = db.inquiries.filter(inq => inq.id !== inqId);
    saveDB(db);
  },

  login(email: string, password: string) {
    if (email === 'admin@tesla.com' && password === 'admin123') {
      const token = 'mock-tesla-admin-token-abcdef';
      localStorage.setItem('tesla_admin_token', token);
      return {
        token,
        user: { email: 'admin@tesla.com', role: 'admin' }
      };
    }
    return null;
  },

  logout() {
    localStorage.removeItem('tesla_admin_token');
  },

  getToken() {
    return localStorage.getItem('tesla_admin_token');
  }
};
