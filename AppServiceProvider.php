<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Car;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Store a newly created customer inquiry in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'nullable|exists:cars,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:30',
            'message' => 'required|string|max:2000',
        ]);

        // Auto determine car name for inquiry record (for data safety)
        $carName = 'General Inquiry';
        if (!empty($validated['car_id'])) {
            $car = Car::find($validated['car_id']);
            if ($car) {
                $carName = $car->name;
            }
        }

        Inquiry::create([
            'car_id' => $validated['car_id'] ?? null,
            'car_name' => $carName,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'message' => $validated['message'],
            'status' => 'pending', // Starts pending
        ]);

        return redirect()->back()->with('success', 'Your catalog request has been designed and captured! One of our specialists will reach out shortly.');
    }
}
