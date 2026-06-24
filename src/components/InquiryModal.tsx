import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { Car, SiteSettings } from '../types.js';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCar: Car | null;
  settings: SiteSettings;
  availableCars: Car[];
}

export default function InquiryModal({
  isOpen,
  onClose,
  selectedCar,
  settings,
  availableCars
}: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carId, setCarId] = useState(selectedCar?.id || 'general');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle setting car selection when selectedCar changes dynamically
  React.useEffect(() => {
    if (selectedCar) {
      setCarId(selectedCar.id);
    } else {
      setCarId('general');
    }
  }, [selectedCar]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!name || !email || !phone || !message) {
      setErrorMsg('All fields are required. Please submit standard fields.');
      setLoading(false);
      return;
    }

    // Determine chosen car label for inquiry payload
    let finalCarName = 'General Inquiry';
    if (carId !== 'general') {
      const parentCar = availableCars.find(c => c.id === carId);
      if (parentCar) finalCarName = parentCar.name;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          carId,
          carName: finalCarName,
          name,
          email,
          phone,
          message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit inquiry form.');
      }

      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Server network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Dismiss trigger */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-full z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* SUCCESS CASE SCREEN */
          <div className="w-full p-8 md:p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mb-6 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-white font-display uppercase tracking-widest text-2xl font-bold mb-3">
              Delivery Request Saved
            </h3>
            <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed mb-6">
              Thank you, <span className="text-white font-semibold">{name}</span>! Your specifications reservation inquiry for{' '}
              <span className="text-white font-semibold">
                {carId === 'general' ? 'our fleet catalog' : availableCars.find(c => c.id === carId)?.name}
              </span>{' '}
              was recorded securely in our Customer Database. A certified configurations specialist will analyze details and call your lines shortly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full mb-8 font-mono text-xs text-left text-neutral-400">
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-white/5 flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-red-500" />
                <div>
                  <span className="block text-[9px] uppercase text-neutral-500">Contact Schedule</span>
                  <span className="text-white font-medium">Within 24 Hours</span>
                </div>
              </div>
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-white/5 flex items-center space-x-3">
                <Clock className="w-4 h-4 text-red-500" />
                <div>
                  <span className="block text-[9px] uppercase text-neutral-500">Business Hours</span>
                  <span className="text-white font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="bg-white text-neutral-950 font-bold uppercase text-xs tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          /* FORM ENTRY SCREEN */
          <>
            {/* Left sidebar info (Tesla specs) */}
            <div className="w-full md:w-5/12 bg-neutral-950 p-8 flex flex-col justify-between border-r border-white/5">
              <div>
                <span className="inline-block px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 text-[9px] tracking-widest uppercase font-bold rounded-full mb-6">
                  Configurations Panel
                </span>
                <h3 className="text-white font-display uppercase tracking-wider text-xl font-bold mb-4 leading-snug">
                  Establish Custom Build Configs
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                  Provide your active contact metadata. Our cloud reservations engine automatically syncs configurations with the showroom delivery system.
                </p>
              </div>

              {/* Site metadata labels */}
              <div className="space-y-4 font-mono text-xs border-t border-white/5 pt-6 text-neutral-400">
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-neutral-900 rounded border border-white/5 text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase">Email Support</span>
                    <span className="text-white">{settings.contactEmail || 'sales@tesla-inventory.com'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-neutral-900 rounded border border-white/5 text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase">Phone Hotline</span>
                    <span className="text-white">{settings.contactPhone || '+1 (800) 555-0199'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-neutral-900 rounded border border-white/5 text-neutral-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase">Headquarters</span>
                    <span className="text-white line-clamp-2">{settings.contactAddress || 'Palo Alto, California'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form section */}
            <form onSubmit={handleSubmit} className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-display uppercase tracking-widest text-xs font-semibold mb-6 pb-2 border-b border-white/5">
                  Secure Customer Metadata
                </h4>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-lg mb-4">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4 text-xs font-sans">
                  {/* Name Input */}
                  <div>
                    <label className="text-neutral-400 block tracking-wider font-semibold uppercase mb-1.5 text-[10px]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500 text-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Input */}
                    <div>
                      <label className="text-neutral-400 block tracking-wider font-semibold uppercase mb-1.5 text-[10px]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500 text-xs transition-colors"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="text-neutral-400 block tracking-wider font-semibold uppercase mb-1.5 text-[10px]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                        className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* Selected Car Dropdown */}
                  <div>
                    <label className="text-neutral-400 block tracking-wider font-semibold uppercase mb-1.5 text-[10px]">
                      Selected Fleet Vehicle
                    </label>
                    <select
                      value={carId}
                      onChange={(e) => setCarId(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500 text-xs transition-colors"
                    >
                      <option value="general">Catalog Inquiry (General)</option>
                      {availableCars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.name} ({car.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="text-neutral-400 block tracking-wider font-semibold uppercase mb-1.5 text-[10px]">
                      Specifications Comments / Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="e.g. Please clarify exact paint options, delivery wait times, and charging infrastructure packages."
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500 text-xs transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white font-semibold uppercase text-xs tracking-widest py-3.5 px-6 rounded transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting configs...</span>
                    </>
                  ) : (
                    <span>Submit Specifications Design</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
