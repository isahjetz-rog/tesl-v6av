<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'car_name',
        'name',
        'email',
        'phone',
        'message',
        'status', // pending, contacted, completed
    ];

    protected $casts = [
        'car_id' => 'string',
    ];

    /**
     * Get the specific car related to the inquiry.
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
