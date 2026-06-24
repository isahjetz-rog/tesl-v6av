import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Lock, Zap, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface NavbarProps {
  settings: SiteSettings;
  onScrollToSection: (sectionId: string) => void;
  onClaimClick: () => void;
}

export default function Navbar({ settings, onScrollToSection, onClaimClick }: NavbarProps) {
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
          isScrolled
            ? 'bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl'
            : 'bg-neutral-950/70 py-4 md:py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand Title with red icon */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection('giveaway-section');
            }}
            className="flex items-center space-x-2 text-white font-display tracking-[0.2em] font-extrabold text-lg md:text-xl group"
          >
            <span className="text-red-600 text-2xl font-bold font-sans tracking-tight">T</span>
            <span className="tracking-[0.25em]">{settings.logo || 'TESLA'}</span>
            <span className="text-red-600 font-normal text-xs tracking-widest uppercase ml-1.5 border border-red-600/30 px-1.5 py-0.5 rounded-sm bg-red-600/10">Motors</span>
          </a>

          {/* Centered Navigation menus */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => onScrollToSection(link.target)}
                className="text-neutral-300 text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-red-500 transition-colors py-1 px-2.5 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Claim Now Button (Red CTA) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onClaimClick}
              className="bg-red-600 hover:bg-red-700 active:translate-y-px text-white text-xs font-bold uppercase tracking-[0.18em] px-5 sm:px-7 py-2.5 rounded hover:scale-[1.02] transition-all shadow-md cursor-pointer"
            >
              Claim Now
            </button>

            {/* Mobile Drawer Trigger Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-neutral-300 hover:text-white transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer overlays menu list */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 w-full py-6 px-8 flex flex-col space-y-4 shadow-2xl animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => {
                  onScrollToSection(link.target);
                  setMobileMenuOpen(false);
                }}
                className="text-neutral-300 text-left text-xs tracking-[0.18em] font-semibold uppercase hover:text-red-500 transition-colors py-2"
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
