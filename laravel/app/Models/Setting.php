<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'value'
    ];

    /**
     * Helper to load all settings into an easily accessible array.
     */
    public static function getAllSettings(): array
    {
        $defaultSettings = [
            'title' => 'TESLA INVENTORY',
            'logo' => 'TESLA',
            'favicon' => 'T',
            'contactEmail' => 'sales@tesla-inventory.com',
            'contactPhone' => '+1 (800) 555-0199',
            'contactAddress' => '3500 Deer Creek Road, Palo Alto, CA 94304',
            'socialTwitter' => 'https://twitter.com/tesla',
            'socialInstagram' => 'https://instagram.com/tesla',
            'socialYoutube' => 'https://youtube.com/tesla',
            'socialFacebook' => 'https://facebook.com/tesla',
            'primaryColor' => '#e82127'
        ];

        try {
            $settings = self::pluck('value', 'key')->toArray();
            return array_merge($defaultSettings, $settings);
        } catch (\Exception $e) {
            return $defaultSettings;
        }
    }

    /**
     * Helper to set a setting value.
     */
    public static function set(string $key, ?string $value): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
