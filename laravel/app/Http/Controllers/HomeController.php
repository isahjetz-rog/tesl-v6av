<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Setting;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display the dynamic Tesla Clone Homepage.
     */
    public function index()
    {
        // Load only public active cars, ordered with featured first
        $cars = Car::with('images')
            ->where('active', true)
            ->orderBy('featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Retrieve dynamic settings
        $settings = Setting::getAllSettings();

        // Render blade view
        return view('home', compact('cars', 'settings'));
    }

    /**
     * Display structural specifications details for a single vehicle.
     */
    public function show(string $id)
    {
        $car = Car::with('images')->where('active', true)->findOrFail($id);
        $settings = Setting::getAllSettings();

        return view('cars.show', compact('car', 'settings'));
    }
}
