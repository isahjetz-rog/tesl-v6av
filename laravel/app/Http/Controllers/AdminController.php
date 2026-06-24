<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Inquiry;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Dashboard statistics view.
     */
    public function dashboard()
    {
        $stats = [
            'totalCars' => Car::count(),
            'activeCars' => Car::where('active', true)->count(),
            'totalInquiries' => Inquiry::count(),
            'pendingInquiries' => Inquiry::where('status', 'pending')->count(),
            'contactedInquiries' => Inquiry::where('status', 'contacted')->count(),
            'completedInquiries' => Inquiry::where('status', 'completed')->count(),
        ];

        // Recent inquiries
        $recentInquiries = Inquiry::orderBy('created_at', 'desc')->take(5)->get();
        $settings = Setting::getAllSettings();

        return view('admin.dashboard', compact('stats', 'recentInquiries', 'settings'));
    }

    /**
     * View and search customer inquiries.
     */
    public function inquiries()
    {
        $inquiries = Inquiry::orderBy('created_at', 'desc')->paginate(15);
        $settings = Setting::getAllSettings();

        return view('admin.inquiries', compact('inquiries', 'settings'));
    }

    /**
     * Update inquiry state.
     */
    public function updateInquiryStatus(Request $request, string $id)
    {
        $inquiry = Inquiry::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,completed'
        ]);

        $inquiry->update([
            'status' => $validated['status']
        ]);

        return redirect()->back()->with('success', 'Inquiry status updated successfully.');
    }

    /**
     * Remove customer inquiry record.
     */
    public function destroyInquiry(string $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();

        return redirect()->back()->with('success', 'Customer inquiry removed.');
    }
}
