import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import InquiryModal from './components/InquiryModal.js';
import AdminPanel from './components/AdminPanel.js';
import ClaimPage from './components/ClaimPage.js';
import NotificationToast from './components/NotificationToast.js';
import { Car, Inquiry, SiteSettings } from './types.js';
import { dbStore } from './lib/dbStore.js';
import {
  Mail, Phone, MapPin, Twitter, Instagram, Youtube, Facebook,
  ShieldCheck, CheckCircle2, Lock, Zap, ThumbsUp, MessageSquare,
  Share2, Heart, Award, ArrowUpRight, ChevronRight, Eye, RefreshCw
} from 'lucide-react';

export function AppContent() {
  const [settings, setSettings] = useState<SiteSettings>({} as SiteSettings);
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Modals & triggers
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Auth checking
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  // Path check for Standalone Admin Router
  const isPageAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  // Countdown timer state
  const [hours, setHours] = useState(11);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(33);

  // Active Participant Tracker state
  const [participantsCount, setParticipantsCount] = useState(12847);

  // YouTube video player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Comments section expanding state
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);

  const commentsData = [
    {
      id: 1,
      author: "Mike Johnson",
      initials: "MJ",
      avatarBg: "bg-sky-600",
      time: "2 days ago",
      location: "🇺🇸 USA",
      text: "I received my Tesla car!! I paid the delivery fee and within a week my brand new Tesla Model 3 arrived at my door. 🚗⚡",
      likes: "1.8K",
      replies: "42 Replies",
      isPinned: true
    },
    {
      id: 2,
      author: "Sarah Williams",
      initials: "SW",
      avatarBg: "bg-pink-600",
      time: "1 day ago",
      location: "🇺🇸 USA",
      text: "Just received my Tesla car after paying for the delivery fee. I cried when I saw the car parked outside! 🙏",
      likes: "942",
      replies: "15 Replies"
    },
    {
      id: 3,
      author: "Carlos Mendez",
      initials: "CM",
      avatarBg: "bg-emerald-600",
      time: "3 days ago",
      location: "🇲🇽 Mexico",
      text: "From Mexico! I received my Tesla car after paying the delivery fee. This giveaway is 100% real.",
      likes: "652",
      replies: "8 Replies"
    },
    {
      id: 4,
      author: "David Chen",
      initials: "DC",
      avatarBg: "bg-indigo-600",
      time: "2 days ago",
      location: "🇨🇳 China",
      text: "I was skeptical at first but I paid the delivery fee and received my Tesla EV. Amazing!",
      likes: "482",
      replies: "3 Replies"
    },
    {
      id: 5,
      author: "Amara Osei",
      initials: "AO",
      avatarBg: "bg-amber-600",
      time: "1 day ago",
      location: "🇬🇭 Ghana",
      text: "From Ghana 🇬🇭 I paid for the delivery fee and received my Tesla car! God bless Tesla!",
      likes: "312",
      replies: "1 Reply"
    },
    {
      id: 6,
      author: "Elena Rostova",
      initials: "ER",
      avatarBg: "bg-purple-600",
      time: "2 days ago",
      location: "🇩🇪 Germany",
      text: "Incredible opportunity! My custom blue Tesla Model Y has just arrived in Munich after clearing customs and delivery logistics. Absolute dream machine! 🇩🇪⚡",
      likes: "284",
      replies: "12 Replies"
    },
    {
      id: 7,
      author: "Yuki Tanaka",
      initials: "YT",
      avatarBg: "bg-rose-600",
      time: "3 days ago",
      location: "🇯🇵 Japan",
      text: "I was extremely nervous about the initial delivery payment, but customer assistance was superb. My gorgeous Model S has been parked in Tokyo! Arigato gozaimasu!",
      likes: "198",
      replies: "6 Replies"
    },
    {
      id: 8,
      author: "Marcus Aurelius",
      initials: "MA",
      avatarBg: "bg-slate-600",
      time: "4 days ago",
      location: "🇮🇹 Italy",
      text: "Identity validated, simple delivery fee paid, and Model 3 successfully dispatched to Rome. Extraordinary engineering, completely free as advertised.",
      likes: "156",
      replies: "2 Replies"
    },
    {
      id: 9,
      author: "Jean-Pierre",
      initials: "JP",
      avatarBg: "bg-teal-600",
      time: "5 days ago",
      location: "🇫🇷 France",
      text: "C'est absolument fantastique! I hesitated initially, but my Midnight Cherry Red Model Y has just landed at my residence. A truly authentic global campaign! 🇫🇷🚗",
      likes: "112",
      replies: "4 Replies"
    },
    {
      id: 10,
      author: "Priya Patel",
      initials: "PP",
      avatarBg: "bg-orange-600",
      time: "6 days ago",
      location: "🇬🇧 United Kingdom",
      text: "Brilliant campaign! Paid for the shipping option and got the right-hand drive Tesla Model 3 delivered directly to my London flat. Praise God! 🙏🇬🇧",
      likes: "95",
      replies: "7 Replies"
    }
  ];

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('tesla_site_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('tesla_site_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f9f9f9';
    }
  }, [theme]);

  // Sync favicon based on settings
  useEffect(() => {
    let faviconElement = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!faviconElement) {
      faviconElement = document.createElement('link');
      faviconElement.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(faviconElement);
    }

    if (settings.logo && settings.logo.startsWith("data:image")) {
      faviconElement.href = settings.logo;
    } else if (settings.favicon && settings.favicon !== "T") {
      faviconElement.href = settings.favicon;
    } else {
      faviconElement.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e82127'><path d='M12,2C11.38,3.4 9.47,4.86 6,5.34V6.44C8.91,6.13 10.91,5 11.45,3.69V17.92C11.45,18.42 11.23,19.38 10,20V21C11,20.73 12,20.5 12,20.5C12,20.5 13,20.73 14,21V20C12.77,19.38 12.55,18.42 12.55,17.92V3.69C13.09,5 15.09,6.13 18,6.44V5.34C14.53,4.86 12.62,3.4 12,2M4,2V2.62C7.38,3.13 9.42,4.35 10,5.43V4.18C8.91,3.4 6.73,2.44 4,2M20,2C17.27,2.44 15.09,3.4 14,4.18V5.43C14.58,4.35 16.62,3.13 20,2.62V2z'/></svg>";
    }
  }, [settings.favicon, settings.logo]);

  // Sync brand settings
  const fetchSettings = () => {
    try {
      const data = dbStore.getSettings();
      setSettings(data);
      if (data.title && !isPageAdmin) {
        document.title = data.title;
      } else if (isPageAdmin) {
        document.title = "Tesla Motors Admin — Secure Workspace Console";
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Sync cars 
  const fetchCars = () => {
    try {
      const token = dbStore.getToken();
      const isAdmin = !!token;
      setIsAdminLoggedIn(isAdmin);

      const data = dbStore.getCars(isAdmin);
      setCars(data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  // Sync inquiries
  const fetchInquiries = () => {
    const token = dbStore.getToken();
    if (!token) return;

    try {
      const data = dbStore.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  // Run on startup
  useEffect(() => {
    fetchSettings();
    fetchCars();
  }, []);

  // Sync inquiries on admin logon
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchInquiries();
    }
  }, [isAdminLoggedIn]);

  // Smooth scroll logic when visiting `/cars`
  useEffect(() => {
    if (location.pathname === '/cars') {
      setTimeout(() => {
        const el = document.getElementById('participate-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location.pathname]);

  // Countdown timer ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setMinutes((prevMin) => {
          if (prevMin > 0) return prevMin - 1;
          setHours((prevHour) => {
            if (prevHour > 0) return prevHour - 1;
            return 11; // Reset to loop
          });
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Softly increment participants count to simulate live crowd traffic
  useEffect(() => {
    const participantTimer = setInterval(() => {
      setParticipantsCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(participantTimer);
  }, []);

  // Scroll to customized layout section
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set selected car and open claim page config
  const handleInquireCar = (car: Car) => {
    setSelectedCar(car);
    navigate('/participate');
  };

  // Maps specifications pricing dynamically to estimated delivery rates
  const getDeliveryFee = (price: number) => {
    if (price < 45000) return 199;
    if (price >= 45000 && price < 60000) return 299;
    if (price >= 60000 && price < 80000) return 349;
    if (price >= 80000 && price < 120000) return 399;
    return 499;
  };

  // Live Deliveries feed standard logs
  const liveDeliveriesLog = [
    { name: 'Fatima A.', country: 'ae UAE', car: 'Tesla Model 3 2025', status: 'Car dispatched 🚚', fee: '$299', time: '32 min ago' },
    { name: 'Emma W.', country: 'ca Canada', car: 'Tesla Model Y 2025', status: 'Vehicle en route 🚚', fee: '$349', time: '40 min ago' },
    { name: 'Raj P.', country: 'in India', car: 'Tesla Model 3 2024', status: 'Delivery confirmed ✔', fee: '$299', time: '19 min ago' },
    { name: 'Fatima A.', country: 'ae UAE', car: 'Tesla Cybertruck 2025', status: 'Car dispatched 🚚', fee: '$379', time: '15 min ago' },
    { name: 'Hans M.', country: 'de Germany', car: 'Tesla Cybertruck 2025', status: 'Vehicle en route 🚚', fee: '$399', time: '18 min ago' },
    { name: 'Lucas B.', country: 'br Brazil', car: 'Tesla Model Y 2025', status: 'Delivery confirmed ✔', fee: '$349', time: '54 min ago' },
    { name: 'Amara N.', country: 'za South Africa', car: 'Tesla Model X 2025', status: 'Shipment confirmed ✔', fee: '$399', time: '58 min ago' },
    { name: 'Fatima A.', country: 'ae UAE', car: 'Tesla Model S 2025', status: 'Car dispatched 🚚', fee: '$399', time: '31 min ago' },
    { name: 'Liam M.', country: 'ie Ireland', car: 'Tesla Model Y 2025', status: 'Delivery confirmed ✔', fee: '$349', time: '31 min ago' },
  ];

  /* ---------------------------------------------------- */
  /* Routing configuration using React Router            */
  /* ---------------------------------------------------- */
  return (
    <Routes>
      <Route path="/admin" element={
        <div id="tesla_admin_full_page" className="bg-neutral-950 min-h-screen text-white select-none">
          <AdminPanel
            settings={settings}
            onSettingsUpdate={(newSets) => setSettings(newSets)}
            cars={cars}
            onCarsUpdate={() => {
              fetchCars();
              fetchInquiries();
            }}
            inquiries={inquiries}
            onInquiriesUpdate={() => fetchInquiries()}
            onClose={() => {
              navigate('/');
            }}
          />
        </div>
      } />
      <Route path="/participate" element={
        <ClaimPage
          cars={cars}
          selectedCar={selectedCar}
          settings={settings}
          onClose={() => {
            navigate('/');
          }}
          onSuccess={() => {
            fetchInquiries();
          }}
          theme={theme}
        />
      } />
      <Route path="/*" element={
        <div
          id="tesla_global_app"
          className={`min-h-screen leading-relaxed font-sans scroll-smooth relative overflow-hidden transition-colors duration-300 selection:bg-red-600 selection:text-white ${theme === 'light' ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-950 text-white'
            }`}
        >
          {/* Atmospheric ambient glows */}
          {theme === 'dark' && (
            <>
              <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
              <div className="absolute top-[35%] left-[10%] w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[140px] pointer-events-none z-0" />
              <div className="absolute top-[65%] right-[5%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
              <div className="absolute top-[85%] left-[20%] w-[450px] h-[450px] bg-red-800/5 rounded-full blur-[130px] pointer-events-none z-0" />
            </>
          )}

          {/* Absolute Stick Top Navbar with trust badging layout */}
          <Navbar
            settings={settings}
            onScrollToSection={handleScrollToSection}
            onClaimClick={() => navigate('/participate')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* Main one-page divisions container */}
          <main className="pt-[140px] md:pt-[120px] transition-all relative z-10">

            {/* ==================================================== */}
            {/* SECTION 1: GIVEAWAY HERO SECTION                     */}
            {/* ==================================================== */}
            <section
              id="giveaway-section"
              className={`relative min-h-[90vh] md:min-h-screen max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 py-16 scroll-mt-24 border-b ${theme === 'light' ? 'border-neutral-200' : 'border-white/5'
                }`}
            >
              {/* Left information list */}
              <div className="flex-1 space-y-6 text-left animate-fadeIn">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3.5 py-1.5 text-[10px] sm:text-xs tracking-[0.18em] font-extrabold uppercase rounded-full flex items-center space-x-1 ${theme === 'light'
                    ? 'bg-red-600/10 border border-red-500/25 text-red-600'
                    : 'bg-red-600/10 border border-red-500/20 text-red-500'
                    }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-0.5 animate-pulse"></span>
                    <span>Official Live Event</span>
                  </span>
                  <span className={`px-3.5 py-1.5 border text-[10px] sm:text-xs tracking-[0.12em] uppercase rounded-full font-mono ${theme === 'light'
                    ? 'bg-white border-neutral-200 text-neutral-600'
                    : 'bg-neutral-900 border-white/5 text-neutral-400'
                    }`}>
                    ● LIVE — <span className={`${theme === 'light' ? 'text-neutral-900 font-bold' : 'text-white font-bold'}`}>{participantsCount.toLocaleString()}</span> joined
                  </span>
                </div>

                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none max-w-2xl uppercase ${theme === 'light' ? 'text-neutral-900' : 'text-white'
                  }`}>
                  Win a <span className="text-red-600">Brand New</span> Tesla Electric Car
                </h1>

                <p className={`text-sm md:text-base leading-relaxed max-w-lg ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'
                  }`}>
                  Tesla Motors is giving away zero-emission, custom-built electric vehicles to consumers worldwide. Claim your premium vehicle configuration instantly. Just clear the one-time local dispatch delivery cost.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 max-w-md">
                  <button
                    onClick={() => navigate('/participate')}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold uppercase tracking-[0.18em] px-8 py-4 rounded transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_12px_28px_rgba(220,38,38,0.5)] cursor-pointer"
                  >
                    Claim Your Free Car ➔
                  </button>
                  <button
                    onClick={() => handleScrollToSection('info-section')}
                    className={`w-full sm:w-auto text-xs font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded transition-all cursor-pointer border ${theme === 'light'
                      ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      : 'bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-300 hover:text-white'
                      }`}
                  >
                    View All Proof
                  </button>
                </div>

                {/* Subtext icons list */}
                <div className={`pt-6 flex items-center space-x-6 text-[10px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                  <div className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Client</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Global Transit</span>
                  </div>
                </div>
              </div>

              {/* Right graphics frame card */}
              <div className="flex-1 w-full relative">
                <div className={`relative group overflow-hidden border rounded-3xl p-6 md:p-8 flex items-center justify-center transition-all duration-300 ${theme === 'light'
                  ? 'bg-white border-neutral-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.05)]'
                  : 'bg-neutral-900 border-white/5 shadow-[0_20px_45px_rgba(0,0,0,0.6)]'
                  }`}>

                  {/* Image banner */}
                  <img
                    src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                    alt="Tesla Model S Plaid Cherry Red"
                    referrerPolicy="no-referrer"
                    className="w-full max-w-md h-auto object-contain rounded-2xl brightness-95 transform hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />

                  {/* Subdued information card title tag overlay */}
                  <div className={`absolute bottom-6 left-6 right-6 backdrop-blur-md rounded-xl p-3.5 border flex items-center justify-between text-xs font-mono ${theme === 'light'
                    ? 'bg-white/90 border-neutral-200 text-neutral-800'
                    : 'bg-neutral-950/80 border-white/10 text-neutral-450'
                    }`}>
                    <div>
                      <p className={`font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Tesla Electric Car</p>
                      <p className={`text-[10px] uppercase mt-0.5 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>100% Free — Only Local Delivery Apply</p>
                    </div>
                    <span className="bg-red-600 text-white font-bold uppercase py-1 px-3.5 rounded text-[10px] tracking-widest flex items-center space-x-1">
                      <span>Free</span>
                    </span>
                  </div>
                </div>
              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION ID: AVAILABLE MINI GRID STATS TRADING        */}
            {/* ==================================================== */}
            <section className={`py-16 px-6 md:px-12 border-b transition-colors duration-300 ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
              }`}>
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2 className={`text-2xl sm:text-3xl font-display font-medium uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                    Available <span className="text-red-600 font-extrabold">Tesla Cars</span>
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl mx-auto font-sans leading-relaxed ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Choose your preferred Tesla electric car. All models are brand new 2024-2025 editions delivered straight to your door.
                  </p>
                </div>

                {/* Horizontal Mini Grid for 4 Primary Models */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                  <div className={`border p-5 rounded-2xl relative flex flex-col justify-between transition-all group ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200 hover:border-red-600/30 shadow-sm hover:shadow-md'
                    : 'bg-neutral-900 border-white/5 hover:border-red-600/20'
                    }`}>
                    <span className="absolute top-4 right-4 bg-red-600 text-white font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                      Most Popular
                    </span>
                    <div>
                      <h3 className={`text-base font-bold uppercase tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Tesla Model 3 2025</h3>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>358 mi range • 510 hp</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 text-xs">
                      <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                      <button onClick={() => handleScrollToSection('participate-section')} className={`transition-colors flex items-center space-x-1 ${theme === 'light' ? 'text-neutral-500 group-hover:text-red-600' : 'text-neutral-400 group-hover:text-white'}`}>
                        <span>View Model</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`border p-5 rounded-2xl relative flex flex-col justify-between transition-all group ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200 hover:border-red-600/30 shadow-sm hover:shadow-md'
                    : 'bg-neutral-900 border-white/5 hover:border-red-600/20'
                    }`}>
                    <span className="absolute top-4 right-4 bg-red-600 text-white font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                      Best SUV
                    </span>
                    <div>
                      <h3 className={`text-base font-bold uppercase tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Tesla Model Y 2025</h3>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>330 mi range • 384 hp</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 text-xs">
                      <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                      <button onClick={() => handleScrollToSection('participate-section')} className={`transition-colors flex items-center space-x-1 ${theme === 'light' ? 'text-neutral-500 group-hover:text-red-600' : 'text-neutral-400 group-hover:text-white'}`}>
                        <span>View Model</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`border p-5 rounded-2xl relative flex flex-col justify-between transition-all group ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200 hover:border-red-600/30 shadow-sm hover:shadow-md'
                    : 'bg-neutral-900 border-white/5 hover:border-red-600/20'
                    }`}>
                    <span className={`absolute top-4 right-4 font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest ${theme === 'light' ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-950 border border-white/10 text-neutral-400'
                      }`}>
                      Premium
                    </span>
                    <div>
                      <h3 className={`text-base font-bold uppercase tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Tesla Model S 2025</h3>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>405 mi range • 670 hp</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 text-xs">
                      <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                      <button onClick={() => handleScrollToSection('participate-section')} className={`transition-colors flex items-center space-x-1 ${theme === 'light' ? 'text-neutral-500 group-hover:text-red-600' : 'text-neutral-400 group-hover:text-white'}`}>
                        <span>View Model</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`border p-5 rounded-2xl relative flex flex-col justify-between transition-all group ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200 hover:border-red-600/30 shadow-sm hover:shadow-md'
                    : 'bg-neutral-900 border-white/5 hover:border-red-600/20'
                    }`}>
                    <span className={`absolute top-4 right-4 font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest ${theme === 'light' ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-950 border border-white/10 text-neutral-400'
                      }`}>
                      Eco Pick
                    </span>
                    <div>
                      <h3 className={`text-base font-bold uppercase tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Tesla Model X 2025</h3>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>348 mi range • 670 hp</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 text-xs">
                      <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                      <button onClick={() => handleScrollToSection('participate-section')} className={`transition-colors flex items-center space-x-1 ${theme === 'light' ? 'text-neutral-500 group-hover:text-red-600' : 'text-neutral-400 group-hover:text-white'}`}>
                        <span>View Model</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION 2: OFFICIAL ANNOUNCEMENT & PROOF             */}
            <section id="info-section" className="py-20 px-6 md:px-12 border-b scroll-mt-24 bg-neutral-950 border-white/5 text-white">
              <div className="max-w-4xl mx-auto space-y-16">
                {/* 4. OFFICIAL ANNOUNCEMENT SECTION */}
                <div className="text-center space-y-3">
                  <span className="text-red-600 text-xs tracking-[0.2em] font-extrabold uppercase font-mono">● OFFICIAL ANNOUNCEMENT</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider text-white">
                    Tesla's <span className="text-red-600">Global Car</span> Giveaway
                  </h2>
                  <p className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed text-neutral-400">
                    Watch Tesla's official announcement of their biggest car giveaway for all countries worldwide.
                  </p>
                </div>

                {/* Video Mockup Frame */}
                <div className="border rounded-3xl overflow-hidden relative shadow-[0_15px_35px_rgba(0,0,0,0.5)] bg-neutral-900 border-white/5">
                  <div className="aspect-video w-full relative">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/XTeWKmlNmN8?rel=0&modestbranding=1&playsinline=1"
                      title="Tesla Official Announcement"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* 5. WINNERS TESTIMONIAL VIDEO SECTION */}
                <div className="space-y-6 pt-6 border-t border-dashed border-white/10">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wider text-white">
                      More <span className="text-red-600 font-bold">Proof</span> from Winners
                    </h2>
                    <p className="text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed text-neutral-400">
                      Watch real testimonials from Tesla car recipients around the world.
                    </p>
                  </div>

                  {/* YouTube Video Direct Responsive Player */}
                  <div className="border rounded-3xl overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-neutral-900 border-white/5">
                    <div className="aspect-video w-full relative">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/XDkzm_LR0Co"
                        title="YouTube video player"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />

                    </div>
                  </div>
                </div>

                {/* 6. YOUTUBE REPLICA COMMENTS MODULE */}
                <div className="border rounded-3xl p-6 md:p-8 space-y-6 font-sans bg-neutral-900/60 border-white/5">
                  {/* Channel Meta Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-10 w-10 bg-red-600 text-white font-extrabold rounded-full flex items-center justify-center font-display text-sm tracking-tight shadow animate-pulse">
                        T
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-bold text-white">Tesla Global</span>
                          <span className="inline-block bg-sky-500 text-white text-[8px] font-sans rounded-full px-1 py-0.5 scale-90">✓</span>
                        </div>
                        <span className="font-sans text-xs text-neutral-400">12.8M subscribers</span>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors ml-2 font-sans">
                        Subscribe
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-xs px-4 py-2 rounded-full flex items-center space-x-1.5 cursor-pointer transition-all font-sans border bg-neutral-900 border-white/5 text-neutral-300 hover:bg-neutral-800">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>1.2M</span>
                      </div>
                      <div className="text-xs px-4 py-2 rounded-full flex items-center space-x-1.5 cursor-pointer transition-all font-sans border bg-neutral-900 border-white/5 text-neutral-300 hover:bg-neutral-800">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>75K</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Title Banner */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm font-bold uppercase tracking-wider font-display text-white">Comments • 75,600</span>
                    <span className="text-xs hover:text-red-500 cursor-pointer flex items-center space-x-1 font-mono text-neutral-400">
                      <span>SORT BY</span>
                      <span>▼</span>
                    </span>
                  </div>

                  {/* Feed Stack */}
                  <div className="space-y-6 divide-y text-xs sm:text-sm divide-white/5">
                    {commentsData.slice(0, visibleCommentsCount).map((comment, index) => (
                      <div key={comment.id} className={`${index > 0 ? 'pt-5' : 'pt-4'} flex space-x-3 items-start`}>
                        <div className={`h-8 w-8 ${comment.avatarBg} text-white font-bold rounded-full flex items-center justify-center font-display text-xs flex-shrink-0`}>
                          {comment.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white">{comment.author}</span>
                            <span className="text-neutral-500 text-[10px]">{comment.time} • {comment.location}</span>
                            {comment.isPinned && (
                              <span className="bg-red-600/10 text-red-500 text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-red-500/20 tracking-widest font-extrabold scale-90">PINNED</span>
                            )}
                          </div>
                          <p className="mt-1.5 font-sans leading-relaxed text-neutral-300">
                            {comment.text}
                          </p>
                          <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-400">
                            <button className="hover:text-red-500 flex items-center space-x-1">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-mono">{comment.likes}</span>
                            </button>
                            {comment.replies && (
                              <button className="hover:text-red-500 flex items-center space-x-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-mono">{comment.replies}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View More Comments / Hide when full 10 comments are displayed */}
                  {visibleCommentsCount < 10 && (
                    <div className="text-center pt-5 border-t border-white/5">
                      <button
                        onClick={() => setVisibleCommentsCount(prev => Math.min(prev + 5, 10))}
                        className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors uppercase tracking-[0.1em]"
                      >
                        View More Comments
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION 3: MORE PROOF FROM WINNERS / CEOS            */}
            {/* ==================================================== */}
            <section className="py-20 px-6 md:px-12 border-b bg-neutral-950 border-white/5 text-white">
              <div className="max-w-4xl mx-auto space-y-16">

                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wider text-white">
                    Executive <span className="text-red-600 font-bold">Endorsement</span>
                  </h2>
                  <p className="text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed text-neutral-400">
                    Verified statements and direct validation records from Tesla official social nodes.
                  </p>
                </div>

                {/* Dynamic CEO Elon Musk Twitter Post Frame */}
                <div className="border rounded-3xl p-6 md:p-8 font-sans space-y-4 shadow-xl bg-neutral-900 border-white/5">
                  <div className="flex items-center justify-between border-b pb-4 border-white/5">
                    <div className="flex items-center space-x-3">
                      <span className="h-10 w-10 border text-white font-bold rounded-full flex items-center justify-center font-display text-sm bg-neutral-950 border-white/10">
                        𝕏
                      </span>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-sm text-white">Elon Musk</span>
                          <span className="text-[10px] select-none bg-sky-500 text-white rounded-full px-1 py-0.5 scale-90">✓</span>
                        </div>
                        <span className="text-[11px] block font-mono text-neutral-400">@elonmusk • CEO, Tesla, Inc.</span>
                      </div>
                    </div>
                    <span className="bg-[#1DA1F2]/10 text-sky-500 dark:text-sky-400 text-[10px] tracking-wider uppercase font-mono px-3 py-1.5 rounded border border-[#1DA1F2]/20">Verified Account</span>
                  </div>

                  <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans text-neutral-200">
                    "Tesla is committed to accelerating the world's transition to sustainable energy. As part of our mission, we're launching a worldwide giveaway of our electric vehicles — completely free. Just cover the delivery cost and a brand-new Tesla will be shipped directly to your door. 🚗⚡"
                  </div>

                  <div className="py-2.5 border-y flex flex-wrap gap-6 text-[11px] font-mono border-white/5 text-neutral-400">
                    <span>10:42 AM • June 22, 2026</span>
                    <span>•</span>
                    <span><strong className="text-white">128.4K</strong> Retweets</span>
                    <span>•</span>
                    <span><strong className="text-white">470K</strong> Likes</span>
                  </div>

                  <div className="flex items-center justify-around pt-1 text-xs text-neutral-400">
                    <button className="flex items-baseline space-x-1.5 hover:text-red-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>8.2K</span>
                    </button>
                    <button className="flex items-baseline space-x-1.5 hover:text-[#1DA1F2]">
                      <RefreshCw className="w-4 h-4 scale-95" />
                      <span>128K</span>
                    </button>
                    <button className="flex items-baseline space-x-1.5 hover:text-red-500">
                      <Heart className="w-4 h-4" />
                      <span>470K</span>
                    </button>
                    <button className="flex items-baseline space-x-1.5 hover:text-red-500">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Social credentials grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                  <div className="border p-6 rounded-2xl space-y-2 bg-neutral-900 border-white/5">
                    <div className="flex items-center space-x-2">
                      <Twitter className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold font-mono text-white">@Tesla</span>
                    </div>
                    <p className="text-xs text-neutral-400">Official X/Twitter announcement platform</p>
                    <span className="text-[10px] text-neutral-500 font-mono block">28M Followers • Verified</span>
                  </div>
                  <div className="border p-6 rounded-2xl space-y-2 bg-neutral-900 border-white/5">
                    <div className="flex items-center space-x-2">
                      <Facebook className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold font-mono text-white">Tesla Motors</span>
                    </div>
                    <p className="text-xs text-neutral-400">Official Tesla Group Facebook pages</p>
                    <span className="text-[10px] text-neutral-500 font-mono block">14.2M Likes • Verified</span>
                  </div>
                  <div className="border p-6 rounded-2xl space-y-2 bg-neutral-900 border-white/5">
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold font-mono text-white">@teslamotors</span>
                    </div>
                    <p className="text-xs text-neutral-400">Tesla global showroom dispatch posts</p>
                    <span className="text-[10px] text-neutral-500 font-mono block">12.8M Followers • Verified</span>
                  </div>
                </div>

              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION 4: HOW TO CLAIM YOUR TESLA CAR               */}
            {/* ==================================================== */}
            <section id="instruction-section" className={`py-20 px-6 md:px-12 border-b scroll-mt-24 transition-colors duration-300 ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
              }`}>
              <div className="max-w-7xl mx-auto space-y-12">

                <div className="text-center space-y-2">
                  <h2 className={`text-2xl sm:text-3xl font-display font-medium uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                    How to Claim Your <span className="text-red-600 font-bold">Tesla Car</span>
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-xl mx-auto font-sans ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Follow these simple steps to receive your brand new Tesla electric car giveaway.
                  </p>
                </div>

                {/* Instruction layout box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto font-sans">
                  <div className={`p-8 rounded-3xl relative overflow-hidden group border ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200/80 shadow-sm'
                    : 'bg-neutral-900/80 border-white/5'
                    }`}>
                    <div className={`absolute top-0 right-0 h-24 w-24 font-black text-6xl flex items-center justify-center font-display leading-none select-none opacity-20 group-hover:scale-105 transition-transform ${theme === 'light' ? 'bg-red-600/5 text-neutral-300' : 'bg-red-600/5 text-neutral-850'
                      }`}>
                      01
                    </div>
                    <h3 className={`text-lg font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Register Your Details</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Enter your name, physical home delivery address, and active mobile contact information so Tesla dispatch specialists can process reservation credentials and ship your car directly.
                    </p>
                  </div>

                  <div className={`p-8 rounded-3xl relative overflow-hidden group border ${theme === 'light'
                    ? 'bg-neutral-50 border-neutral-200/80 shadow-sm'
                    : 'bg-neutral-900/80 border-white/5'
                    }`}>
                    <div className={`absolute top-0 right-0 h-24 w-24 font-black text-6xl flex items-center justify-center font-display leading-none select-none opacity-20 group-hover:scale-105 transition-transform ${theme === 'light' ? 'bg-red-600/5 text-neutral-300' : 'bg-red-600/5 text-neutral-850'
                      }`}>
                      02
                    </div>
                    <h3 className={`text-lg font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Choose Your Tesla Car</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Select your preferred high-performance Tesla model: Model 3, Model Y, Model S, or Model X — all brand new 2024-2025 editions equipped with full autopilot suites.
                    </p>
                  </div>
                </div>

              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION 5: CHOOSE YOUR TESLA GRID INVENTORY AREA     */}
            {/* ==================================================== */}
            <section id="participate-section" className={`py-20 px-6 md:px-12 border-b scroll-mt-24 transition-colors duration-300 ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
              }`}>
              <div className="max-w-7xl mx-auto space-y-12">

                {/* Center Banner Headers */}
                <div className="text-center space-y-4">
                  <span className={`inline-block border text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded font-mono ${theme === 'light'
                    ? 'bg-red-600/10 border-red-500/25 text-red-600'
                    : 'bg-red-600/10 border border-red-500/30 text-red-500'
                    }`}>
                    Official Tesla Global Giveaway
                  </span>
                  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                    Choose Your <span className="text-red-600">Tesla Electric Car</span>
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl mx-auto font-sans leading-relaxed ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Tesla is gifting brand new electric vehicles to participants worldwide. Check live availability lists below and submit your specifications configurations.
                  </p>
                </div>

                {/* Live countdown timer bar */}
                <div className={`max-w-xl mx-auto border rounded-2xl p-5 md:p-6 text-center space-y-4 shadow-xl transition-all duration-300 ${theme === 'light'
                  ? 'bg-neutral-50 border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)]'
                  : 'bg-neutral-900 border-white/10 shadow-2xl'
                  }`}>
                  <div className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center space-x-2 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                    <span>Limited Configurations Available • Event Ends In:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto font-sans text-white select-none">
                    <div className={`border rounded-xl py-3 flex flex-col items-center ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
                      }`}>
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-600">
                        {String(hours).padStart(2, '0')}
                      </span>
                      <span className={`text-[8px] uppercase tracking-wider mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Hours</span>
                    </div>
                    <div className={`border rounded-xl py-3 flex flex-col items-center ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
                      }`}>
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-600">
                        {String(minutes).padStart(2, '0')}
                      </span>
                      <span className={`text-[8px] uppercase tracking-wider mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Mins</span>
                    </div>
                    <div className={`border rounded-xl py-3 flex flex-col items-center ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-white/5'
                      }`}>
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-600 animate-pulse">
                        {String(seconds).padStart(2, '0')}
                      </span>
                      <span className={`text-[8px] uppercase tracking-wider mt-1 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Secs</span>
                    </div>
                  </div>

                  <p className={`text-[10px] sm:text-xs font-mono uppercase tracking-widest pt-1 border-t ${theme === 'light' ? 'text-neutral-400 border-neutral-200' : 'text-neutral-500 border-white/5'
                    }`}>
                    Current queue load: <strong className={`${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>{participantsCount + 412} active connections</strong> • Global delivery approved
                  </p>
                </div>

                {/* Dynamic Cars Listings Area from Database */}
                {cars.filter(c => c.active).length === 0 ? (
                  <div className={`text-center py-16 border rounded-3xl ${theme === 'light' ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-white/5'
                    }`}>
                    <p className="text-neutral-400 text-sm">Synchronizing vehicle lists...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
                    {cars.filter(c => c.active).map((car) => {
                      
                      const fee = getDeliveryFee(car.price);
                      const bgImg = car.images && car.images.length > 0
                        ? car.images[0]
                        : "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80";
                      return (
                        <div
                          key={car.id}
                          className={`border rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2 ${theme === 'light'
                            ? 'bg-neutral-50 border-neutral-200 hover:border-red-500/40 hover:shadow-[0_20px_40px_rgba(232,33,39,0.05)]'
                            : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-white/5 hover:border-red-500/30 hover:shadow-[0_20px_40px_rgba(232,33,39,0.08)]'
                            }`}
                        >
                          {/* Thumbnail block with featured ribbon badging */}
                          <div className="aspect-video relative overflow-hidden bg-neutral-950">
                            <img
                              src={bgImg}
                              alt={car.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {car.featured && (
                              <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded shadow">
                                ★ Top Choice
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 rounded border border-white/10 tracking-widest">
                              ONE-TIME DISPATCH
                            </div>
                          </div>

                          {/* Info details */}
                          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex items-baseline justify-between">
                                <h3 className={`text-lg font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{car.name}</h3>
                                <span className={`text-xs font-mono ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>({car.year})</span>
                              </div>

                              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                {car.description || 'Full performance dual drive electric battery pack with zero delay torque and premium cabin specifications.'}
                              </p>
                            </div>

                            {/* Specs row */}
                            <div className={`grid grid-cols-2 gap-3.5 p-4 rounded-2xl border text-[11px] font-mono ${theme === 'light'
                              ? 'bg-white border-neutral-200 text-neutral-600'
                              : 'bg-neutral-950/60 border-white/5 text-neutral-400'
                              }`}>
                              <div>
                                <span className={`block text-[8px] uppercase ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>Range (EPA)</span>
                                <span className={`font-medium ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>{car.specifications?.range || '320 mi'}</span>
                              </div>
                              <div>
                                <span className={`block text-[8px] uppercase ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>Acceleration</span>
                                <span className={`font-medium ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>{car.specifications?.zeroToSixty || '3.5 s'}</span>
                              </div>
                              <div>
                                <span className={`block text-[8px] uppercase ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>Top Speed</span>
                                <span className={`font-medium ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>{car.specifications?.topSpeed || '155 mph'}</span>
                              </div>
                              <div>
                                <span className={`block text-[8px] uppercase ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>Drivetrain</span>
                                <span className={`font-medium truncate block max-w-[100px] ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>{car.specifications?.drivetrain || 'AWD'}</span>
                              </div>
                            </div>

                            {/* Value vs Fee comparisons */}
                            <div className={`border-t pt-4 flex items-center justify-between ${theme === 'light' ? 'border-neutral-200' : 'border-white/5'
                              }`}>
                              <div>
                                <span className={`text-[10px] block uppercase font-mono ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>Original Est. Value</span>
                                <span className={`text-xs line-through font-semibold font-sans ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                  ${car.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className={`text-[10px] block uppercase font-bold font-mono tracking-wider ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>One-Time Delivery Fee</span>
                                <span className="text-red-500 text-lg font-black font-mono">
                                  ${fee}
                                </span>
                              </div>
                            </div>

                            {/* Submit Actions */}
                            <button
                              onClick={() => handleInquireCar(car)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.15em] py-3.5 rounded-xl transition-all shadow group-hover:scale-[1.01] flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>Claim This Tesla Now</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </section>


            {/* ==================================================== */}
            {/* SECTION 6: LIVE DELIVERIES TRANSACTION FEED          */}
            {/* ==================================================== */}
            <section id="transactions-section" className={`py-20 px-6 md:px-12 scroll-mt-24 transition-colors duration-300 ${theme === 'light' ? 'bg-white' : 'bg-neutral-950'
              }`}>
              <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">

                <div className="text-center space-y-2">
                  <span className="text-red-600 text-xs tracking-[0.2em] font-extrabold uppercase font-mono">● LIVE TRANSACTION FEED</span>
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>
                    Live <span className="text-red-600 font-bold">Deliveries</span>
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Real-time updates of Tesla car deliveries happening right now across the world.
                  </p>
                </div>

                {/* Custom transaction log frame */}
                <div className={`border rounded-3xl overflow-hidden font-sans text-xs sm:text-sm transition-all duration-300 ${theme === 'light'
                  ? 'bg-neutral-50 border-neutral-200 shadow-sm'
                  : 'bg-neutral-900 border-white/5 shadow-2xl'
                  }`}>
                  <div className={`p-4 border-b flex items-center justify-between px-6 ${theme === 'light' ? 'bg-neutral-100/60 border-neutral-200' : 'bg-neutral-950/80 border-white/5'
                    }`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Global Dispatch Log</span>
                    <span className="flex items-center space-x-1 text-emerald-500 font-bold font-mono text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>SYSTEM ONLINE</span>
                    </span>
                  </div>

                  <div className={`divide-y ${theme === 'light' ? 'divide-neutral-200' : 'divide-white/5'}`}>
                    {liveDeliveriesLog.map((log, index) => (
                      <div key={index} className={`p-4 sm:p-5 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans transition-colors ${theme === 'light' ? 'hover:bg-neutral-100/50' : 'hover:bg-neutral-900/40'
                        }`}>

                        {/* Customer */}
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center font-display border border-red-500/10 text-xs flex-shrink-0">
                            {log.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className={`font-bold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{log.name}</span>
                              <span className={`text-[9px] uppercase tracking-widest font-mono ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>({log.country})</span>
                            </div>
                            <span className={`text-[11px] block mt-0.5 ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Paid secure global transit</span>
                          </div>
                        </div>

                        {/* Car dispatched state */}
                        <div className="flex items-center space-x-2">
                          <span className={`border text-[10px] sm:text-xs px-3 py-1.5 rounded-full font-mono uppercase tracking-wide ${theme === 'light'
                            ? 'bg-white border-neutral-200 text-neutral-800'
                            : 'bg-neutral-950 border-white/10 text-white'
                            }`}>
                            {log.car}
                          </span>
                          <span className="text-emerald-500 font-semibold text-[11px]">{log.status}</span>
                        </div>

                        {/* Price and timestamp */}
                        <div className="sm:text-right font-mono">
                          <div className={`font-bold text-xs sm:text-sm ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>
                            {log.fee} <span className={`text-[9px] font-normal ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'}`}>paid</span>
                          </div>
                          <span className="text-neutral-500 text-[10px] block mt-0.5">{log.time}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

          </main>

          {/* Modern corporate footer */}
          <footer id="site_footer" className="bg-neutral-950 py-16 px-6 md:px-12 border-t border-white/5 text-xs text-neutral-400 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">

              <div className="space-y-3 max-w-sm">
                <h3 className="font-display tracking-[0.2em] uppercase font-bold text-lg text-white">
                  {settings.logo || 'TESLA'} MOTORS
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed capitalize font-sans">
                  Accelerating the global transition to clean, fully sustainable electric driving options. Built securely.
                </p>
                <div className="pt-2 flex items-center space-x-2 text-[10px] text-neutral-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Global Secure Certification 🔒</span>
                </div>
              </div>

              {/* Social connection circles */}
              <div className="flex items-center space-x-4">
                {settings.socialTwitter && (
                  <a
                    href={settings.socialTwitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all shadow"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.socialInstagram && (
                  <a
                    href={settings.socialInstagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all shadow"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.socialYoutube && (
                  <a
                    href={settings.socialYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all shadow"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.socialFacebook && (
                  <a
                    href={settings.socialFacebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all shadow"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-left md:text-right font-mono text-zinc-400">
                <div className="flex items-center md:justify-end space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{settings.contactEmail || 'sales@tesla-inventory.com'}</span>
                </div>
                <div className="flex items-center md:justify-end space-x-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{settings.contactPhone || '+1 (800) 555-0199'}</span>
                </div>
                <div className="flex items-center md:justify-end space-x-2 text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 text-neutral-700" />
                  <span>{settings.contactAddress || 'Palo Alto, CA'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 mt-12 pt-8 text-center text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
              <p>© {new Date().getFullYear()} {settings.logo || 'TESLA'} MOTORS INC. SECURE SYSTEM CERTIFIED.</p>
            </div>
          </footer>

          {/* Automatic Slide-In Customer Toast Notification Popup */}
          <NotificationToast theme={theme} />

          {/* Digital reservation inquiry form overlay */}
          <InquiryModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            selectedCar={selectedCar}
            settings={settings}
            availableCars={cars.filter(c => c.active)}
          />

        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
