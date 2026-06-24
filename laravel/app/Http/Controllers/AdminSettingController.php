<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    /**
     * Show general settings panel form.
     */
    public function index()
    {
        $settings = Setting::getAllSettings();
        return view('admin.settings', compact('settings'));
    }

    /**
     * Save/Update modified settings in index.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'logo' => 'required|string|max:255',
            'favicon' => 'required|string|max:50',
            'contactEmail' => 'required|email|max:255',
            'contactPhone' => 'required|string|max:50',
            'contactAddress' => 'required|string|max:500',
            'socialTwitter' => 'nullable|url|max:255',
            'socialInstagram' => 'nullable|url|max:255',
            'socialYoutube' => 'nullable|url|max:255',
            'socialFacebook' => 'nullable|url|max:255',
            'primaryColor' => 'required|string|regex:/^#[a-fA-F0-9]{6}$/',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', 'Site branding metadata successfully updated.');
    }
}
