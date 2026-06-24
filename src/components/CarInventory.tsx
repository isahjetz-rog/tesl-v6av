import React, { useState } from 'react';
import { Sparkles, Compass, CheckCircle2, BadgePercent } from 'lucide-react';
import { Car } from '../types.js';

interface CarInventoryProps {
  cars: Car[];
  onInquireClick: (car: Car) => void;
}

export default function CarInventory({ cars, onInquireClick }: CarInventoryProps) {
  const activeCars = cars.filter(car => car.active);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sedan' | 'suv' | 'truck'>('all');

  // Filter lists based on type tags
  const getFilteredCars = () => {
    if (selectedFilter === 'all') return activeCars;
    return activeCars.filter(car => {
      const name = car.name.toLowerCase();
      const desc = car.description.toLowerCase();
      if (selectedFilter === 'sedan') {
        return name.includes('model s') || name.includes('model 3') || name.includes('sedan');
      }
      if (selectedFilter === 'suv') {
        return name.includes('model y') || name.includes('model x') || name.includes('suv') || name.includes('crossover');
      }
      if (selectedFilter === 'truck') {
        return name.includes('cyber') || name.includes('beast') || name.includes('truck');
      }
      return true;
    });
  };

  const filtered = getFilteredCars();

  return (
    <section id="tesla_inventory_grid" className="bg-neutral-950 py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div>
            <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Available Cars</span>
            <h2 className="text-white font-display uppercase tracking-widest text-3xl md:text-4xl font-bold">Dynamic Fleet Reserve</h2>
            <p className="text-neutral-400 text-sm max-w-xl mt-2 leading-relaxed">
              Explore our dynamic fleet of fully-electric extreme-performance models. Select any vehicle to submit an immediate design delivery request.
            </p>
          </div>

          {/* Filter handles */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {(['all', 'sedan', 'suv', 'truck'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full font-medium transition-all ${
                  selectedFilter === type
                    ? 'bg-white text-neutral-950 font-bold shadow-md shadow-white/5'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {type === 'all' ? 'All Models' : type + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-white/5">
            <Compass className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-bold uppercase tracking-wider">No models match criteria</h3>
            <p className="text-neutral-500 text-xs mt-1">Please try choosing another filter button above to load more vehicles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((car) => {
              const mainImg = car.images && car.images.length > 0 ? car.images[0] : '';

              return (
                <div
                  key={car.id}
                  className="bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/15 hover:bg-neutral-900/60 transition-all duration-300 group"
                >
                  <div>
                    {/* Visual Container */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-950">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={car.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700 uppercase font-mono text-xs">
                          No Image Uploaded
                        </div>
                      )}
                      
                      {/* Price / Year tags */}
                      <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-xs font-bold">
                        ${car.price.toLocaleString()}
                      </div>
                      <div className="absolute top-4 left-4 bg-red-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/10 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                        {car.year} Release
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-white font-display text-lg uppercase tracking-wider font-bold">
                          {car.name}
                        </h3>
                        {car.featured && (
                          <span className="flex items-center gap-1 text-[9px] text-red-400 bg-red-500/10 font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border border-red-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>
                      
                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-6">
                        {car.description || 'No detailed Description available.'}
                      </p>

                      {/* Specs micro table */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                        {car.specifications?.range && (
                          <div>
                            <span className="text-neutral-500 uppercase text-[9px] block">Range (EPA)</span>
                            <span className="text-white font-semibold">{car.specifications.range}</span>
                          </div>
                        )}
                        {car.specifications?.zeroToSixty && (
                          <div>
                            <span className="text-neutral-500 uppercase text-[9px] block">0-60 MPH</span>
                            <span className="text-white font-semibold">{car.specifications.zeroToSixty}</span>
                          </div>
                        )}
                        {car.specifications?.topSpeed && (
                          <div>
                            <span className="text-neutral-500 uppercase text-[9px] block">Top Speed</span>
                            <span className="text-white font-semibold">{car.specifications.topSpeed}</span>
                          </div>
                        )}
                        {car.specifications?.drivetrain && (
                          <div>
                            <span className="text-neutral-500 uppercase text-[9px] block">Drivetrain</span>
                            <span className="text-white font-semibold truncate max-w-[120px] block">{car.specifications.drivetrain}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Trigger */}
                  <div className="p-6 pt-0 mt-4">
                    <button
                      onClick={() => onInquireClick(car)}
                      className="w-full bg-neutral-800 text-white font-semibold uppercase text-[10px] tracking-widest py-3 hover:bg-white hover:text-neutral-950 transition-all rounded-lg active:scale-95 duration-150 border border-white/5"
                    >
                      Configure Deliveries
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
