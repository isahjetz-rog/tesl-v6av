@extends('layouts.app')

@section('content')

<!-- Vertical snapping slides container -->
<div class="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar text-white">
    
    @foreach($cars->where('featured', true) as $index => $car)
        <section id="car-slide-{{ $car->id }}" class="h-screen w-full snap-start relative flex flex-col justify-between pt-24 pb-16 px-6 cursor-default">
            
            <!-- Background Image -->
            @if($car->images->first())
                <img src="{{ $car->images->first()->path }}" alt="{{ $car->name }}" class="absolute inset-0 w-full h-full object-cover -z-10 brightness-75 select-none" />
            @else
                <div class="absolute inset-0 bg-neutral-900 -z-10"></div>
            @endif

            <!-- Mask gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/40 -z-10 pointer-events-none"></div>

            <!-- Top Header -->
            <div class="text-center mt-6">
                <h1 class="text-white font-display uppercase tracking-widest font-bold text-4xl md:text-5xl lg:text-6xl mb-2 drop-shadow-md">
                    {{ $car->name }}
                </h1>
                <p class="text-neutral-300 font-sans tracking-wide text-sm md:text-base capitalize">
                    Inquire for custom delivery and local configuration options
                </p>
            </div>

            <!-- Specifications metrics overlay at bottom of the slide -->
            <div class="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4 bg-neutral-950/20 backdrop-blur-[2px] rounded-2xl py-6 md:py-4">
                <div class="grid grid-cols-2 md:flex items-center justify-around flex-grow gap-8 md:gap-4 text-center md:px-8">
                    @if(!empty($car->specifications['range']))
                        <div class="flex flex-col">
                            <span class="font-sans font-semibold text-xl lg:text-2xl text-white">{{ $car->specifications['range'] }}</span>
                            <span class="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Range (EPA)</span>
                        </div>
                    @endif
                    @if(!empty($car->specifications['zeroToSixty']))
                        <div class="flex flex-col">
                            <span class="font-sans font-semibold text-xl lg:text-2xl text-white">{{ $car->specifications['zeroToSixty'] }}</span>
                            <span class="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">0-60 MPH</span>
                        </div>
                    @endif
                    @if(!empty($car->specifications['topSpeed']))
                        <div class="flex flex-col">
                            <span class="font-sans font-semibold text-xl lg:text-2xl text-white">{{ $car->specifications['topSpeed'] }}</span>
                            <span class="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Top Speed</span>
                        </div>
                    @endif
                    <div class="flex flex-col">
                        <span class="font-sans font-semibold text-xl lg:text-2xl text-red-500">${{ number_format($car->price) }}</span>
                        <span class="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">Est. Value</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <button onclick="openBooking('{{ $car->id }}', '{{ $car->name }}')" class="w-full sm:w-auto bg-white text-neutral-950 font-semibold uppercase text-xs tracking-widest py-3 px-8 rounded hover:bg-neutral-200 transition-colors shadow-lg">
                        Request Inquiry
                    </button>
                    <a href="#tesla_inventory_grid" class="w-full sm:w-auto bg-neutral-900/80 text-white font-medium text-center uppercase text-xs tracking-widest py-3 px-8 rounded border border-white/25 hover:bg-white/10 transition-all">
                        View Details
                    </a>
                </div>
            </div>
        </section>
    @endforeach

</div>

<!-- Available Fleet Grid -->
<section id="tesla_inventory_grid" class="bg-neutral-950 py-24 px-6 md:px-12 border-t border-white/5">
    <div class="max-w-7xl mx-auto">
        <div class="mb-16">
            <span class="text-red-500 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Available Cars</span>
            <h2 class="text-white font-display uppercase tracking-widest text-3xl md:text-4xl font-bold">Dynamic Fleet Reserve</h2>
            <p class="text-gray-400 text-sm max-w-xl mt-1">
                Explore our dynamic active reserve of highly refined electric supercars. Configure and inquire.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($cars as $car)
                <div class="bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/15 transition-all group">
                    <div>
                        <!-- Cover Visual -->
                        <div class="relative aspect-video overflow-hidden bg-neutral-950">
                            @if($car->images->first())
                                <img src="{{ $car->images->first()->path }}" alt="{{ $car->name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            @endif
                            <div class="absolute top-4 right-4 bg-neutral-950/80 px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-xs font-bold">
                                ${{ number_format($car->price) }}
                            </div>
                        </div>

                        <!-- Content descriptions -->
                        <div class="p-6">
                            <h3 class="text-white font-display text-lg uppercase tracking-wider font-bold mb-2">
                                {{ $car->name }}
                            </h3>
                            <p class="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-6">
                                {{ $car->description }}
                            </p>

                            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                                <div>
                                    <span class="text-neutral-500 uppercase text-[9px] block">Range</span>
                                    <span class="text-white font-semibold">{{ $car->specifications['range'] ?? 'N/A' }}</span>
                                </div>
                                <div>
                                    <span class="text-neutral-500 uppercase text-[9px] block">0-60 MPH</span>
                                    <span class="text-white font-semibold">{{ $car->specifications['zeroToSixty'] ?? 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 pt-0 mt-4">
                        <button onclick="openBooking('{{ $car->id }}', '{{ $car->name }}')" class="w-full bg-neutral-800 text-white text-[10px] tracking-widest uppercase py-3 rounded-lg hover:bg-white hover:text-neutral-950 transition-colors">
                            Configure Deliveries
                        </button>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Configuration Booking Popup Modal Dialog backdrop -->
<div id="bookingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md hidden antialiased">
    <div class="relative w-full max-w-2xl bg-neutral-900 border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
        <button onclick="closeBooking()" class="absolute top-6 right-6 text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-full">
            Dismiss
        </button>

        <h3 class="text-white font-display uppercase tracking-widest text-lg font-bold mb-6">Request Build Specs</h3>
        
        <form action="{{ route('inquiries.store') }}" method="POST" class="space-y-4 text-xs font-sans">
            @csrf
            <input type="hidden" name="car_id" id="modal_car_id" value="">

            <div>
                <label class="text-neutral-400 block tracking-wider uppercase mb-1.5 text-[9px] font-semibold">Your Name</label>
                <input type="text" name="name" required class="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-neutral-400 block tracking-wider uppercase mb-1.5 text-[9px] font-semibold">Email Address</label>
                    <input type="email" name="email" required class="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none" />
                </div>
                <div>
                    <label class="text-neutral-400 block tracking-wider uppercase mb-1.5 text-[9px] font-semibold">Phone Number</label>
                    <input type="tel" name="phone" required class="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none" />
                </div>
            </div>

            <div>
                <label class="text-neutral-400 block tracking-wider uppercase mb-1.5 text-[9px] font-semibold">Selected model</label>
                <input type="text" id="modal_car_name_display" disabled class="w-full bg-neutral-950/50 border border-white/10 rounded px-4 py-3 text-neutral-400 text-xs cursor-not-allowed" />
            </div>

            <div>
                <label class="text-neutral-400 block tracking-wider uppercase mb-1.5 text-[9px] font-semibold">Message Comments</label>
                <textarea name="message" rows="4" required class="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-3.5 rounded tracking-widest text-xs transition-colors mt-6 uppercase">
                Submit Specifications Design
            </button>
        </form>
    </div>
</div>

<script>
    function openBooking(id, name) {
        document.getElementById('modal_car_id').value = id;
        document.getElementById('modal_car_name_display').value = name;
        document.getElementById('bookingModal').classList.remove('hidden');
    }
    function closeBooking() {
        document.getElementById('bookingModal').classList.add('hidden');
    }
</script>

@endsection
