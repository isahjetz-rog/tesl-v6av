<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\CarImage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCarController extends Controller
{
    /**
     * Display listing of cars in management panel.
     */
    public function index()
    {
        $cars = Car::with('images')->orderBy('created_at', 'desc')->get();
        $settings = Setting::getAllSettings();

        return view('admin.cars.index', compact('cars', 'settings'));
    }

    /**
     * Show vehicle creation page.
     */
    public function create()
    {
        $settings = Setting::getAllSettings();
        return view('admin.cars.create', compact('settings'));
    }

    /**
     * Store new vehicle card.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 2),
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'featured' => 'boolean',
            'active' => 'boolean',
            'spec_range' => 'nullable|string|max:100',
            'spec_zero_sixty' => 'nullable|string|max:100',
            'spec_top_speed' => 'nullable|string|max:100',
            'spec_drivetrain' => 'nullable|string|max:100',
            'spec_power' => 'nullable|string|max:100',
            'spec_battery' => 'nullable|string|max:100',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:8192',
        ]);

        // specifications JSON package
        $specifications = [
            'range' => $request->integer('spec_range') ? $request->input('spec_range') . ' mi' : ($request->input('spec_range') ?? ''),
            'zeroToSixty' => $request->input('spec_zero_sixty') ? $request->input('spec_zero_sixty') . ' s' : ($request->input('spec_zero_sixty') ?? ''),
            'topSpeed' => $request->input('spec_top_speed') ? $request->input('spec_top_speed') . ' mph' : ($request->input('spec_top_speed') ?? ''),
            'drivetrain' => $request->input('spec_drivetrain') ?? 'Dual Motor AWD',
            'power' => $request->input('spec_power') ?? '',
            'battery' => $request->input('spec_battery') ?? ''
        ];

        // Create the Car Model
        $car = Car::create([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'year' => $validated['year'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'specifications' => $specifications,
            'featured' => $request->has('featured'),
            'active' => $request->has('active') || $request->input('active', true),
        ]);

        // Upload and bind car photos
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $imageFile) {
                // Store on 'public' disk inside 'cars' directory
                $path = $imageFile->store('cars', 'public');
                
                CarImage::create([
                    'car_id' => $car->id,
                    'path' => '/storage/' . $path, // Serveable asset URL link
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.cars.index')->with('success', 'Vehicle catalog card successfully added.');
    }

    /**
     * Show vehicle edit page.
     */
    public function edit(string $id)
    {
        $car = Car::with('images')->findOrFail($id);
        $settings = Setting::getAllSettings();

        return view('admin.cars.edit', compact('car', 'settings'));
    }

    /**
     * Update vehicle properties and photos.
     */
    public function update(Request $request, string $id)
    {
        $car = Car::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 2),
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'featured' => 'boolean',
            'active' => 'boolean',
            'spec_range' => 'nullable|string|max:100',
            'spec_zero_sixty' => 'nullable|string|max:100',
            'spec_top_speed' => 'nullable|string|max:100',
            'spec_drivetrain' => 'nullable|string|max:100',
            'spec_power' => 'nullable|string|max:100',
            'spec_battery' => 'nullable|string|max:100',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:8192',
        ]);

        $specifications = [
            'range' => $request->input('spec_range') ?? '',
            'zeroToSixty' => $request->input('spec_zero_sixty') ?? '',
            'topSpeed' => $request->input('spec_top_speed') ?? '',
            'drivetrain' => $request->input('spec_drivetrain') ?? 'Dual Motor AWD',
            'power' => $request->input('spec_power') ?? '',
            'battery' => $request->input('spec_battery') ?? ''
        ];

        // Update properties
        $car->update([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'year' => $validated['year'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'specifications' => $specifications,
            'featured' => $request->has('featured'),
            'active' => $request->has('active'),
        ]);

        // Upload any newly selected images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $imageFile) {
                $path = $imageFile->store('cars', 'public');
                
                CarImage::create([
                    'car_id' => $car->id,
                    'path' => '/storage/' . $path,
                    'sort_order' => $car->images()->count() + $index,
                ]);
            }
        }

        return redirect()->route('admin.cars.index')->with('success', 'Vehicle catalog details saved successfully.');
    }

    /**
     * Delete car and clean files from Storage.
     */
    public function destroy(string $id)
    {
        $car = Car::with('images')->findOrFail($id);

        // Delete related physical file uploads from storage disk
        foreach ($car->images as $image) {
            // Translate URL path back to disk reference: /storage/cars/xyz.png -> public/cars/xyz.png
            $relativePath = str_replace('/storage/', '', $image->path);
            Storage::disk('public')->delete($relativePath);
            $image->delete();
        }

        $car->delete();

        return redirect()->route('admin.cars.index')->with('success', 'Vehicle and associated storage images deleted.');
    }

    /**
     * Quick status toggles for admins without full edit form loading.
     */
    public function toggleActive(string $id)
    {
        $car = Car::findOrFail($id);
        $car->active = !$car->active;
        $car->save();

        return redirect()->back()->with('success', 'Vehicle visibility toggled.');
    }
}
