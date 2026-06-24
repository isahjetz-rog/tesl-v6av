import React from 'react';
import { ChevronDown, ArrowRight, Star } from 'lucide-react';
import { Car } from '../types.js';

interface HeroSliderProps {
  cars: Car[];
  onInquireClick: (car: Car) => void;
  onExploreStockClick: () => void;
}

export default function HeroSlider({ cars, onInquireClick, onExploreStockClick }: HeroSliderProps) {
  const featuredCars = cars.filter(car => car.featured && car.active);
  // Fallback to top cars if none are explicitly featured
  const displayCars = featuredCars.length > 0 ? featuredCars : cars.slice(0, 3);

  if (displayCars.length === 0) {
    return (
      <section className="h-screen bg-neutral-900 w-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white font-display text-4xl mb-4 font-bold uppercase tracking-wider">No Active Vehicles</h1>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
          The inventory database is currently empty. Access the admin system to add dynamic vehicles or seed preconfigured items.
        </p>
        <button
          onClick={onExploreStockClick}
          className="text-white border border-white/20 px-6 py-2 rounded uppercase text-xs tracking-widest hover:bg-white/10 transition-all font-semibold"
        >
          Seeding Admin Portal
        </button>
      </section>
    );
  }

  return (
    <div id="tesla_hero_container" className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar text-white">
      {displayCars.map((car) => {
        // Find single image or use dynamic fallback styling
        const bgImg = car.images && car.images.length > 0 ? car.images[0] : '';

        return (
          <section
            key={car.id}
            id={`car-slide-${car.id}`}
            className="h-screen w-full snap-start relative flex flex-col justify-between pt-24 pb-16 px-6 cursor-default transition-all duration-700"
          >
            {/* Background Image / Overlay gradient */}
            {bgImg ? (
              <img
                src={bgImg}
                alt={car.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover -z-10 brightness-75 select-none"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-950 -z-10" />
            )}
            
            {/* Subtle bottom-to-top shadow drape */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/40 -z-10 pointer-events-none" />

            {/* Top Heading Block */}
            <div className="text-center mt-6 animate-fadeIn">
              <h1 className="text-white font-display uppercase tracking-widest font-bold text-4xl md:text-5xl lg:text-6xl mb-2 drop-shadow-md">
                {car.name}
              </h1>
              <p className="text-neutral-300 font-sans tracking-wide text-sm md:text-base capitalize drop-shadow-sm">
                Inquire for dynamic custom delivery and local configuration
              </p>
            </div>

            {/* Metrics specifications tray (Bottom Section) */}
            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4 bg-neutral-950/20 backdrop-blur-[2px] rounded-2xl py-6 md:py-4">
              {/* Responsive Specs list */}
              <div className="grid grid-cols-2 md:flex items-center justify-around flex-grow gap-8 md:gap-4 text-center md:px-8">
                {car.specifications?.range && (
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-xl lg:text-2xl text-white">{car.specifications.range}</span>
                    <span className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Range (EPA)</span>
                  </div>
                )}
                
                {car.specifications?.zeroToSixty && (
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-xl lg:text-2xl text-white">{car.specifications.zeroToSixty}</span>
                    <span className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">0-60 MPH</span>
                  </div>
                )}

                {car.specifications?.topSpeed && (
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-xl lg:text-2xl text-white">{car.specifications.topSpeed}</span>
                    <span className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Top Speed</span>
                  </div>
                )}

                {car.specifications?.drivetrain && (
                  <div className="flex flex-col hidden sm:flex">
                    <span className="font-sans font-semibold text-sm lg:text-base text-white truncate max-w-[120px]">{car.specifications.drivetrain}</span>
                    <span className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Drivetrain</span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-xl lg:text-2xl text-red-500">
                    ${car.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Est. Value</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => onInquireClick(car)}
                  className="w-full sm:w-auto bg-white text-neutral-950 font-semibold uppercase text-xs tracking-widest py-3 px-8 rounded hover:bg-neutral-200 transition-colors shadow-lg active:scale-95 duration-150"
                >
                  Request Inquiry
                </button>
                <button
                  onClick={onExploreStockClick}
                  className="w-full sm:w-auto bg-neutral-900/80 text-white font-medium uppercase text-xs tracking-widest py-3 px-8 rounded border border-white/25 hover:bg-white/10 hover:border-white transition-all shadow-md active:scale-95 duration-150"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Downwards scroll prompt indicator */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70 pointer-events-none">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 mb-1">Scroll</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </section>
        );
      })}
    </div>
  );
}
