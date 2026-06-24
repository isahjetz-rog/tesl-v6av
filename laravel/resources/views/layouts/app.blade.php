<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $settings['title'] ?? 'TESLA INVENTORY' }}</title>
    <!-- Custom paired fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        .snap-y { scroll-snap-type: y mandatory; }
        .snap-start { scroll-snap-align: start; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-neutral-950 text-white font-sans antialiased selection:bg-red-600 selection:text-white">

    <!-- Navbar Floating Element -->
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-neutral-950/85 backdrop-blur-md border-b border-white/5 py-4">
        <div class="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
            <a href="{{ route('home') }}" class="font-display tracking-[0.3em] font-bold text-xl md:text-2xl hover:opacity-85 transition-opacity">
                {{ $settings['logo'] ?? 'TESLA' }}
            </a>
            
            <nav class="hidden lg:flex items-center space-x-8">
                @foreach($cars->take(4) as $car)
                    <a href="#car-slide-{{ $car->id }}" class="text-white text-xs font-medium tracking-widest uppercase hover:text-red-500 transition-colors py-1 px-3">
                        {{ $car->name }}
                    </a>
                @@endforeach
                <a href="#tesla_inventory_grid" class="text-white text-xs font-medium tracking-widest uppercase hover:bg-white/5 transition-all py-1 px-3 rounded border border-white/10">
                    Available Stock
                </a>
            </nav>

            <div class="flex items-center space-x-4">
                @auth
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center space-x-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border bg-red-600/20 text-red-400 border-red-500/30">
                        Admin Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="flex items-center space-x-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border bg-white/10 border-white/10 hover:bg-white/20">
                        Admin Login
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Page Body content -->
    <main>
        @yield('content')
    </main>

    <!-- Web Footer -->
    <footer class="bg-neutral-950 py-16 px-6 md:px-12 border-t border-white/5 text-xs text-neutral-400">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
            <div class="space-y-3 max-w-sm">
                <h3 class="font-display tracking-[0.2em] uppercase font-bold text-lg text-white">
                    {{ $settings['logo'] ?? 'TESLA' }} INVENTORY
                </h3>
                <p className="text-neutral-500">
                    Secure performance reservation and configurations server catalog.
                </p>
            </div>

            <div class="flex items-center space-x-4">
                @if(!empty($settings['socialTwitter']))
                    <a href="{{ $settings['socialTwitter'] }}" target="_blank" class="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full transition-all">
                        Twitter
                    </a>
                @endif
                @if(!empty($settings['socialInstagram']))
                    <a href="{{ $settings['socialInstagram'] }}" target="_blank" class="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full transition-all">
                        Instagram
                    </a>
                @endif
                @if(!empty($settings['socialYoutube']))
                    <a href="{{ $settings['socialYoutube'] }}" target="_blank" class="p-2.5 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-full transition-all">
                        YouTube
                    </a>
                @endif
            </div>

            <div class="space-y-2 text-right">
                <p>Email: {{ $settings['contactEmail'] ?? 'sales@tesla-inventory.com' }}</p>
                <p>Phone: {{ $settings['contactPhone'] ?? '+1 (800) 555-0199' }}</p>
                <p class="text-neutral-500">Address: {{ $settings['contactAddress'] ?? 'Palo Alto, California' }}</p>
            </div>
        </div>
        <div class="border-t border-white/5 mt-12 pt-8 text-center text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
            <p>© {{ date('Y') }} {{ $settings['logo'] ?? 'TESLA' }} RETAIL INC. ALL CONFIGS SECURED.</p>
        </div>
    </footer>

</body>
</html>
