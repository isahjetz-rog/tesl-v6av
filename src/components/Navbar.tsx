import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Lock, Zap, CheckCircle2, Sun, Moon } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface NavbarProps {
  settings: SiteSettings;
  onScrollToSection: (sectionId: string) => void;
  onClaimClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ settings, onScrollToSection, onClaimClick, theme, onToggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Giveaway', target: 'giveaway-section' },
    { label: 'Info', target: 'info-section' },
    { label: 'Instruction', target: 'instruction-section' },
    { label: 'Participate', target: 'participate-section' },
    { label: 'Transactions', target: 'transactions-section' },
  ];

  const renderLogo = (imgClassName: string) => {
    const isImageLogo = settings.logo && (
      settings.logo.startsWith('data:image/') ||
      settings.logo.startsWith('http://') ||
      settings.logo.startsWith('https://') ||
      settings.logo.startsWith('/')
    );

    if (isImageLogo) {
      return (
        <img
          src={settings.logo}
          alt={settings.title || "Tesla Motors"}
          className={imgClassName}
          referrerPolicy="no-referrer"
        />
      );
    }

    if (settings.logo && settings.logo !== "TESLA") {
      return (
        <span className={`font-display uppercase tracking-[0.25em] text-sm md:text-base font-extrabold transition-colors ${
          theme === 'light' ? 'text-neutral-900' : 'text-white'
        }`}>
          {settings.logo}
        </span>
      );
    }

    // Fallback default
    return (
      <img
        src="/assets/images/tesla_logo_1782579134236.jpg"
        alt="Tesla Motors"
        className={imgClassName}
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col font-sans select-none pointer-events-none">
      
      {/* 1. TOP TRUST BADGES STRIP (BLACK COEXISTENCE) – Pointer events active */}
      <div className="bg-neutral-950 border-b border-white/5 py-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-neutral-400 font-mono px-4 md:px-8 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-2 md:gap-4">
          <div className="flex items-center space-x-1.5 text-emerald-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Official Event</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sky-400">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Contract Powered</span>
          </div>
          <div className="flex items-center space-x-1.5 text-red-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>10,000+ Paid Out</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FLOATING STICKY HEADER – Pointer events active */}
      <div
        className={`w-full transition-all duration-300 pointer-events-auto ${
          theme === 'light'
            ? isScrolled
              ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-2.5 shadow-md'
              : 'bg-white/80 py-3.5 md:py-4 border-b border-neutral-200/50'
            : isScrolled
              ? 'bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-2.5 shadow-2xl'
              : 'bg-neutral-950/70 py-3.5 md:py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand Title with official red Tesla T icon */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection('giveaway-section');
            }}
            className="flex items-center group pointer-events-auto"
          >
            {renderLogo("h-12 sm:h-14 md:h-18 lg:h-20 w-auto object-contain transition-transform group-hover:scale-[1.02]")}
          </a>

          {/* Centered Navigation menus */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => onScrollToSection(link.target)}
                className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors py-1 px-2.5 cursor-pointer ${
                  theme === 'light'
                    ? 'text-neutral-700 hover:text-red-600'
                    : 'text-neutral-300 hover:text-red-500'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Theme Toggle & Claim Now Button */}
          <div className="flex items-center space-x-4">
            
            {/* Sleek Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={onClaimClick}
              className="bg-red-600 hover:bg-red-700 active:translate-y-px text-white text-xs font-bold uppercase tracking-[0.18em] px-5 sm:px-7 py-2.5 rounded hover:scale-[1.02] transition-all shadow-md cursor-pointer"
            >
              Claim Now
            </button>

            {/* Mobile Drawer Trigger Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden transition-colors p-1 ${
                theme === 'light' ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-300 hover:text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer overlays menu list */}
        {mobileMenuOpen && (
          <div 
            className={`lg:hidden absolute top-full left-0 w-full py-6 px-8 flex flex-col space-y-4 shadow-2xl animate-fadeIn border-b ${
              theme === 'light'
                ? 'bg-white/95 backdrop-blur-xl border-neutral-200'
                : 'bg-neutral-950/95 backdrop-blur-xl border-white/10'
            }`}
          >
            {/* Mobile Menu Logo */}
            <div className={`pb-4 border-b flex justify-start ${theme === 'light' ? 'border-neutral-100' : 'border-white/5'}`}>
              {renderLogo("h-10 w-auto object-contain")}
            </div>
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => {
                  onScrollToSection(link.target);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-xs tracking-[0.18em] font-semibold uppercase transition-colors py-2 ${
                  theme === 'light'
                    ? 'text-neutral-700 hover:text-red-600'
                    : 'text-neutral-300 hover:text-red-500'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onClaimClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-red-600 text-center text-white text-xs tracking-[0.18em] font-bold uppercase py-3 rounded mt-2 hover:bg-red-700 transition-colors"
            >
              Claim Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
